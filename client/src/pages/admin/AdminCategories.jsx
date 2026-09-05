import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Loader from '../../components/Loader';

const PARENT_OPTIONS = ['New Arrival', 'Wedding', 'Clothing', 'Accessories', 'Discover'];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', parent: 'Clothing', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    api.get('/categories').then(({ data }) => setCategories(data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/categories', form);
      toast.success('Category created');
      setForm({ name: '', parent: 'Clothing', description: '' });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Create failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Products in it will remain but lose their category link.')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-xl text-forest mb-6">Categories</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 border border-charcoal/15 p-5 mb-8">
        <input required placeholder="Category name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        <select value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} className="input-field">
          {PARENT_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field col-span-2" />
        <button type="submit" disabled={saving} className="btn-primary col-span-2">{saving ? 'Saving...' : '+ Add Category'}</button>
      </form>

      <div className="border border-charcoal/15 divide-y divide-charcoal/10">
        {categories.map((cat) => (
          <div key={cat._id} className="flex justify-between items-center p-4 text-sm">
            <div>
              <span className="font-medium">{cat.name}</span>
              <span className="text-charcoal/50 ml-2 text-xs">({cat.parent})</span>
            </div>
            <button onClick={() => handleDelete(cat._id)} className="text-red-600 text-xs underline underline-offset-4">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
