import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { resolveImage } from '../../utils/image';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products?limit=100').then(({ data }) => setProducts(data.products)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl text-forest">Products ({products.length})</h2>
        <Link to="/admin/products/new" className="btn-primary text-sm">+ Add Product</Link>
      </div>

      <div className="border border-charcoal/15 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-charcoal/5 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="p-3 flex items-center gap-3">
                  <img src={resolveImage(p.variants?.[0]?.images?.[0])} alt="" className="w-10 h-12 object-cover bg-charcoal/5" />
                  {p.name}
                </td>
                <td className="p-3 text-charcoal/60">{p.category?.name}</td>
                <td className="p-3">₹{p.price.toLocaleString('en-IN')}</td>
                <td className="p-3">{p.stockCount}</td>
                <td className="p-3 flex gap-3">
                  <Link to={`/admin/products/${p._id}/edit`} className="text-forest underline underline-offset-4">Edit</Link>
                  <button onClick={() => handleDelete(p._id)} className="text-red-600 underline underline-offset-4">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
