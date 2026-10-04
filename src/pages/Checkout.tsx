import { HiTrash as TrashIcon } from "react-icons/hi2";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { clearCart, removeProductFromTheCart } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { createOrder } from "../lib/orders";
import { formatNaira } from "../utils/formatNaira";
import { computeTax, getTaxEnabled } from "../lib/tax";

const inputClass =
  "block w-full py-2 indent-2 border-gray-300 outline-none focus:border-gray-400 border border shadow-sm sm:text-sm";

type ContactInfo = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

const Checkout = () => {
  const { productsInCart, subtotal } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [userId, setUserId] = useState<string | null>(null);
  const [contact, setContact] = useState<ContactInfo>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [isSending, setIsSending] = useState(false);

  const [taxEnabled, setTaxEnabledState] = useState(true);
  useEffect(() => {
    getTaxEnabled().then(setTaxEnabledState);
  }, []);
  const tax = computeTax(subtotal, taxEnabled);
  // Shipping is agreed privately with the seller on WhatsApp, not charged here.
  const total = subtotal ? subtotal + tax : 0;

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        toast.error("Please login to checkout");
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("id", session.user.id)
        .maybeSingle();

      const [first = "", ...rest] = (profile?.full_name ?? "").trim().split(" ");

      setUserId(session.user.id);
      setContact({
        email: session.user.email ?? "",
        firstName: first,
        lastName: rest.join(" "),
        phone: profile?.phone ?? "",
        address: profile?.address ?? "",
      });
    };
    load();
  }, [navigate]);

  const validateContact = () => {
    if (
      !contact.email.trim() ||
      !contact.firstName.trim() ||
      !contact.lastName.trim() ||
      !contact.phone.trim() ||
      !contact.address.trim()
    ) {
      toast.error("Please fill in all contact and delivery fields");
      return false;
    }
    if (productsInCart.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }
    // Items added before this cart item shape existed won't have a
    // productId, so the order can't be linked to a real product.
    if (productsInCart.some((p) => !p.productId)) {
      toast.error(
        "Some items in your cart are outdated - please remove them and add them again"
      );
      return false;
    }
    return true;
  };

  const handleWhatsAppContact = async () => {
    if (!validateContact() || !userId || isSending) return;

    setIsSending(true);
    try {
      await createOrder({
        paymentMethod: "whatsapp",
        shippingAddress: contact.address,
        shippingPhone: contact.phone,
        items: productsInCart,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again";
      toast.error(`Couldn't save your order: ${message}`);
      setIsSending(false);
      return;
    }

    const itemLines = productsInCart
      .map((p) => `- ${p.title} (${p.color}, ${p.size}) x${p.quantity} - ${formatNaira(p.price * p.quantity)}`)
      .join("\n");

    const message =
      `Hi KLstores! I'd like to pay for my order.\n\n` +
      `${itemLines}\n\n` +
      `Total (excl. shipping): ${formatNaira(total)}\n\n` +
      `Please let me know the delivery fee.\n\n` +
      `Name: ${contact.firstName} ${contact.lastName}\n` +
      `Phone: ${contact.phone}\n` +
      `Delivery address: ${contact.address}`;

    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER as string;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    dispatch(clearCart());
    toast.success("Order saved — continue on WhatsApp to complete payment");
    navigate("/order-confirmation");
  };

  return (
    <div className="mx-auto max-w-screen-2xl">
      <div className="pb-24 pt-16 px-5 max-[400px]:px-3">
        <h2 className="sr-only">Checkout</h2>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Contact information
              </h2>

              <div className="mt-4">
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    id="email-address"
                    className={inputClass}
                    required
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">
                Shipping information
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="first-name"
                      className={inputClass}
                      required
                      value={contact.firstName}
                      onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="last-name"
                      className={inputClass}
                      required
                      value={contact.lastName}
                      onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Delivery address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      className={inputClass}
                      required
                      value={contact.address}
                      onChange={(e) => setContact({ ...contact, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="phone"
                      className={inputClass}
                      required
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200 pt-10">
              <h2 className="text-lg font-medium text-gray-900">Payment</h2>
              <p className="mt-2 text-sm text-gray-500">
                Send your order to us on WhatsApp and pay directly with the
                seller.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleWhatsAppContact}
                  className="text-white bg-[#25D366] text-center text-xl font-normal tracking-[0.6px] leading-[72px] w-full h-12 flex items-center justify-center gap-2 max-md:text-base disabled:opacity-60"
                >
                  <FaWhatsapp className="text-2xl" />
                  Contact to Pay
                </button>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {productsInCart.map((product) => (
                  <li key={product?.id} className="flex px-4 py-6 sm:px-6">
                    <div className="flex-shrink-0">
                      <img
                        src={product?.image}
                        alt={product?.title}
                        className="w-20 rounded-md"
                      />
                    </div>

                    <div className="ml-6 flex flex-1 flex-col">
                      <div className="flex">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                            {product?.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">{product?.color}</p>
                          <p className="mt-1 text-sm text-gray-500">{product?.size}</p>
                        </div>

                        <div className="ml-4 flow-root flex-shrink-0">
                          <button
                            type="button"
                            className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
                            onClick={() =>
                              dispatch(removeProductFromTheCart({ id: product?.id }))
                            }
                          >
                            <span className="sr-only">Remove</span>
                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-1 items-end justify-between pt-2">
                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {formatNaira(product?.price ?? 0)}
                        </p>

                        <div className="ml-4">
                          <p className="text-base">Quantity: {product?.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatNaira(subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm text-gray-500 text-right">
                    Agreed with the seller on WhatsApp
                  </dd>
                </div>
                {taxEnabled && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Tax (7.5%)</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatNaira(tax)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Total (excl. shipping)</dt>
                  <dd className="text-base font-medium text-gray-900">{formatNaira(total)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
