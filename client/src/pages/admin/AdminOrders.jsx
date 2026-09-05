import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    setLoading(true);
    api.get('/orders').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success('Order status updated');
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2 className="font-display text-xl text-forest mb-6">Orders ({orders.length})</h2>
      <div className="border border-charcoal/15 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-charcoal/5 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Paid</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="p-3 text-xs text-charcoal/60">{order._id}</td>
                <td className="p-3">{order.user?.name}<div className="text-xs text-charcoal/50">{order.user?.email}</div></td>
                <td className="p-3">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${order.isPaid ? 'bg-sage/20 text-sage' : 'bg-charcoal/10 text-charcoal/60'}`}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="input-field !py-1.5 !px-2 text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
