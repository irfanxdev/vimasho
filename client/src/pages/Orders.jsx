import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import { resolveImage } from '../utils/image';

const STATUS_COLORS = {
  Pending: 'bg-charcoal/10 text-charcoal',
  Confirmed: 'bg-sage/20 text-sage',
  Shipped: 'bg-gold/20 text-gold-dark',
  'Out for Delivery': 'bg-gold/30 text-gold-dark',
  Delivered: 'bg-forest/10 text-forest',
  Cancelled: 'bg-red-100 text-red-600',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine').then(({ data }) => setOrders(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;

  if (orders.length === 0) {
    return (
      <div className="container-content py-24 text-center">
        <h1 className="section-heading mb-4">No orders yet</h1>
        <p className="text-charcoal/60 mb-8">Once you place an order, you can track it here.</p>
        <Link to="/products" className="btn-primary inline-flex">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-content py-10">
      <h1 className="section-heading mb-10">My Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border border-charcoal/15">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-charcoal/10 bg-charcoal/5">
              <div className="text-sm">
                <p className="text-charcoal/50">Order ID</p>
                <p className="font-medium">{order._id}</p>
              </div>
              <div className="text-sm">
                <p className="text-charcoal/50">Placed on</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="text-sm">
                <p className="text-charcoal/50">Total</p>
                <p className="font-medium text-forest">₹{order.totalPrice.toLocaleString('en-IN')}</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-charcoal/10'}`}>
                {order.status}
              </span>
            </div>
            <div className="p-5 space-y-3">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex gap-4 items-center text-sm">
                  <img src={resolveImage(item.image)} alt={item.name} className="w-14 h-18 object-cover bg-charcoal/5" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-charcoal/50 text-xs mt-1">
                      {item.color} · {item.size} · Qty {item.quantity} · ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
