import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import {
  AdminOrder,
  OrderStatus,
  getAllOrders,
  setOrderStatus,
} from "../lib/adminOrders";
import { formatNaira } from "../utils/formatNaira";
import { formatDate } from "../utils/formatDate";

type Access = "checking" | "denied" | "allowed";
type Filter = "all" | OrderStatus;

const FILTERS: Filter[] = ["all", "pending", "paid", "fulfilled", "cancelled"];

const BADGE: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  fulfilled: "bg-green-100 text-green-800",
  cancelled: "bg-gray-200 text-gray-600",
};

// Nigerian numbers are often saved as 080..., wa.me needs 234...
const whatsappLink = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `234${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}`;
};

const AdminOrders = () => {
  const navigate = useNavigate();
  const [access, setAccess] = useState<Access>("checking");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    try {
      setOrders(await getAllOrders());
    } catch {
      toast.error("Couldn't load orders. Has migration_09 been run?");
    }
  };

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        toast.error("Please login to view this page");
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!profile?.is_admin) {
        setAccess("denied");
        return;
      }
      setAccess("allowed");
      load();
    };
    check();
  }, [navigate]);

  const changeStatus = async (order: AdminOrder, status: OrderStatus) => {
    if (
      status === "cancelled" &&
      !confirm(
        "Cancel this order? Its items go back into stock, and a cancelled order can't be reopened."
      )
    ) {
      return;
    }
    setBusyId(order.id);
    try {
      await setOrderStatus(order.id, status);
      toast.success(`Order marked ${status}`);
      await load();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again";
      toast.error(`Couldn't update order: ${message}`);
    } finally {
      setBusyId(null);
    }
  };

  if (access === "checking") {
    return <div className="max-w-screen-2xl mx-auto pt-20 px-5">Loading...</div>;
  }
  if (access === "denied") {
    return (
      <div className="max-w-screen-2xl mx-auto pt-20 px-5">
        <p>You don't have access to this page.</p>
      </div>
    );
  }

  const visible =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const count = (f: Filter) =>
    f === "all" ? orders.length : orders.filter((o) => o.status === f).length;

  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5 pb-24 max-[400px]:px-3">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="flex gap-4 mb-6 text-sm">
        <Link to="/admin/products" className="text-brand underline">
          Products
        </Link>
        <span className="font-semibold underline">Orders</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-4 h-9 capitalize text-sm border ${
              filter === f
                ? "bg-brand text-white border-brand"
                : "bg-white text-black border-gray-300"
            }`}
          >
            {f} ({count(f)})
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="text-gray-500">No {filter === "all" ? "" : filter} orders.</p>
      )}

      <div className="flex flex-col gap-4">
        {visible.map((order) => (
          <div key={order.id} className="bg-white border border-gray-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <p className="font-semibold">{order.customerName}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(order.created_at)} · #{order.id.slice(0, 8)}
                </p>
              </div>
              <span
                className={`px-3 py-1 text-sm capitalize rounded-full ${BADGE[order.status]}`}
              >
                {order.status}
              </span>
            </div>

            <ul className="text-sm mb-3 space-y-1">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between gap-4">
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>{formatNaira(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <p className="font-semibold mb-3">
              Total: {formatNaira(order.total)}{" "}
              <span className="font-normal text-sm text-gray-500">
                (shipping not included)
              </span>
            </p>

            <div className="text-sm text-gray-700 mb-4 space-y-1">
              {order.shipping_address && <p>Address: {order.shipping_address}</p>}
              {order.shipping_phone && (
                <p>
                  Phone: {order.shipping_phone} ·{" "}
                  <a
                    href={whatsappLink(order.shipping_phone)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand underline"
                  >
                    Chat on WhatsApp
                  </a>
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {order.status === "pending" && (
                <button
                  disabled={busyId === order.id}
                  onClick={() => changeStatus(order, "paid")}
                  className="px-4 h-9 text-sm text-white bg-brand disabled:opacity-60"
                >
                  Mark paid
                </button>
              )}
              {(order.status === "pending" || order.status === "paid") && (
                <button
                  disabled={busyId === order.id}
                  onClick={() => changeStatus(order, "fulfilled")}
                  className="px-4 h-9 text-sm text-white bg-green-600 disabled:opacity-60"
                >
                  Mark fulfilled
                </button>
              )}
              {(order.status === "pending" || order.status === "paid") && (
                <button
                  disabled={busyId === order.id}
                  onClick={() => changeStatus(order, "cancelled")}
                  className="px-4 h-9 text-sm text-red-600 border border-red-300 disabled:opacity-60"
                >
                  Cancel order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
