import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/orders'), api.get('/products?limit=1000'), api.get('/users')])
      .then(([ordersRes, productsRes, usersRes]) => {
        const orders = ordersRes.data;
        const revenue = orders.filter((o) => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0);
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((o) => o.status === 'Pending').length,
          totalProducts: productsRes.data.total,
          totalUsers: usersRes.data.length,
          revenue,
          recentOrders: orders.slice(0, 5),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}` },
    { label: 'Total Orders', value: stats.totalOrders },
    { label: 'Pending Orders', value: stats.pendingOrders },
    { label: 'Products', value: stats.totalProducts },
    { label: 'Customers', value: stats.totalUsers },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        {cards.map((c) => (
          <div key={c.label} className="border border-charcoal/15 p-5">
            <p className="text-xs text-charcoal/50 uppercase tracking-wide">{c.label}</p>
            <p className="text-2xl font-display text-forest mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl text-forest mb-4">Recent Orders</h2>
      <div className="border border-charcoal/15 divide-y divide-charcoal/10">
        {stats.recentOrders.map((order) => (
          <div key={order._id} className="flex justify-between items-center p-4 text-sm">
            <span className="text-charcoal/70">{order.user?.name || 'Guest'}</span>
            <span className="text-charcoal/50">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
            <span className="font-medium text-forest">₹{order.totalPrice.toLocaleString('en-IN')}</span>
            <span className="text-xs px-3 py-1 bg-charcoal/10 rounded-full">{order.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
