import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import api from '../api/axios';
import Loader from '../components/Loader';
import Motif from '../components/Motif';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader full />;
  if (!order) return <div className="container-content py-20 text-center">Order not found.</div>;

  return (
    <div className="container-content py-24 max-w-lg mx-auto text-center">
      <FiCheckCircle className="text-5xl text-sage mx-auto mb-6" />
      <h1 className="section-heading mb-3">Order Confirmed</h1>
      <p className="text-charcoal/60 mb-2">Thank you — your order has been placed successfully.</p>
      <p className="text-sm text-charcoal/50 mb-8">Order ID: {order._id}</p>
      <Motif className="mx-auto mb-8" />
      <div className="flex justify-center gap-4">
        <Link to="/orders" className="btn-primary">View My Orders</Link>
        <Link to="/products" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  );
}
