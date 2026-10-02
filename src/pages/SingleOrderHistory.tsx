import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getOrder, OrderRow, OrderItemRow } from "../lib/orderHistory";
import { formatDate } from "../utils/formatDate";

const SingleOrderHistory = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        toast.error("Please login to view this page");
        navigate("/login");
        return;
      }

      if (!params.id) return;

      const result = await getOrder(params.id);
      if (!result) {
        setNotFound(true);
        return;
      }
      setOrder(result.order);
      setItems(result.items);
    };
    load();
  }, [navigate, params.id]);

  if (notFound) {
    return (
      <div className="max-w-screen-2xl mx-auto pt-20 px-5">
        <p>This order couldn't be found.</p>
      </div>
    );
  }

  if (!order) {
    return <div className="max-w-screen-2xl mx-auto pt-20 px-5">Loading...</div>;
  }

  const itemsSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>
      <div className="bg-white border border-gray-200 p-5 overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Order ID: {order.id}</h2>
        <p className="mb-2">Date: {formatDate(order.created_at)}</p>
        <p className="mb-2">Items subtotal: ${itemsSubtotal.toFixed(2)}</p>
        <p className="mb-2">Total: ${order.total.toFixed(2)}</p>
        <p className="mb-2 capitalize">Payment method: {order.payment_method}</p>
        <p className="mb-2 capitalize">Status: {order.status}</p>
        {order.shipping_address && (
          <p className="mb-2">Delivery address: {order.shipping_address}</p>
        )}
        {order.shipping_phone && (
          <p className="mb-2">Phone: {order.shipping_phone}</p>
        )}
        {order.paystack_reference && (
          <p className="mb-2">Payment reference: {order.paystack_reference}</p>
        )}

        <h3 className="text-xl font-semibold mt-6 mb-4">Items</h3>
        <table className="singleOrder-table min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-3 px-4 border-b">Product Name</th>
              <th className="py-3 px-4 border-b">Quantity</th>
              <th className="py-3 px-4 border-b">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 px-4 border-b">{item.title}</td>
                <td className="py-3 px-4 border-b text-center">{item.quantity}</td>
                <td className="py-3 px-4 border-b text-right">
                  ${item.price.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SingleOrderHistory;
