import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getOrders, OrderRow } from "../lib/orderHistory";
import { formatDate } from "../utils/formatDate";

const statusLabel: Record<string, string> = {
  pending: "Pending (awaiting WhatsApp payment)",
  paid: "Paid",
  contacted: "Contacted",
  fulfilled: "Fulfilled",
};

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);

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

      setOrders(await getOrders(session.user.id));
    };
    load();
  }, [navigate]);

  if (!orders) {
    return <div className="max-w-screen-2xl mx-auto pt-20 px-5">Loading...</div>;
  }

  return (
    <div className="max-w-screen-2xl mx-auto pt-20 px-5">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">
          You haven't placed any orders yet.{" "}
          <Link to="/shop" className="text-blue-500 hover:underline">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-3 px-4 border-b">Order ID</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Total</th>
                <th className="py-3 px-4 border-b">Payment</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 px-4 border-b text-center">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    ${order.total}
                  </td>
                  <td className="py-3 px-4 border-b text-center capitalize">
                    {order.payment_method}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    {statusLabel[order.status] ?? order.status}
                  </td>
                  <td className="py-3 px-4 border-b text-center">
                    <Link
                      to={`/order-history/${order.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
