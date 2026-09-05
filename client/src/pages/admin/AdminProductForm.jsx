import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiTrash2, FiUploadCloud } from 'react-icons/fi';
import api from '../../api/axios';
import Loader from '../../components/Loader';
import { resolveImage } from '../../utils/image';

const emptyVariant = () => ({ color: '', colorHex: '#0F2A1D', images: [], sizes: [{ size: 'M', stock: 0 }] });

const FIT_OPTIONS = ['Slim', 'Regular', 'Relaxed', 'Classic'];
const OCCASION_OPTIONS = ['Wedding', 'Festive', 'Sangeet', 'Reception', 'Casual', 'Formal', 'Haldi'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    fabric: '',
    fit: 'Regular',
    occasion: ['Festive'],
    price: '',
    discountPrice: '',
    shortDescription: '',
    description: '',
    tags: '',
    isFeatured: false,
    isNewArrival: false,
    variants: [emptyVariant()],
  });

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data));
    if (isEdit) {
      api.get(`/products/id/${id}`).then(({ data }) => {
        setForm({
          ...data,
          category: data.category?._id || data.category,
          tags: (data.tags || []).join(', '),
        });
        setLoading(false);
      });
    }
  }, [id, isEdit]);

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const updateVariant = (index, key, value) => {
    setForm((f) => {
      const variants = [...f.variants];
      variants[index] = { ...variants[index], [key]: value };
      return { ...f, variants };
    });
  };

  const updateSize = (variantIndex, sizeIndex, key, value) => {
    setForm((f) => {
      const variants = [...f.variants];
      const sizes = [...variants[variantIndex].sizes];
      sizes[sizeIndex] = { ...sizes[sizeIndex], [key]: value };
      variants[variantIndex] = { ...variants[variantIndex], sizes };
      return { ...f, variants };
    });
  };

  const addSizeRow = (variantIndex) => {
    setForm((f) => {
      const variants = [...f.variants];
      variants[variantIndex].sizes = [...variants[variantIndex].sizes, { size: 'M', stock: 0 }];
      return { ...f, variants };
    });
  };

  const removeSizeRow = (variantIndex, sizeIndex) => {
    setForm((f) => {
      const variants = [...f.variants];
      variants[variantIndex].sizes = variants[variantIndex].sizes.filter((_, i) => i !== sizeIndex);
      return { ...f, variants };
    });
  };

  const addVariant = () => setForm((f) => ({ ...f, variants: [...f.variants, emptyVariant()] }));
  const removeVariant = (index) => setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }));

  const toggleOccasion = (occ) => {
    setForm((f) => ({
      ...f,
      occasion: f.occasion.includes(occ) ? f.occasion.filter((o) => o !== occ) : [...f.occasion, occ],
    }));
  };

  const handleImageUpload = async (variantIndex, file) => {
    if (!file) return;
    setUploadingIndex(variantIndex);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      // Store the relative path only (e.g. "/uploads/167123.jpg") — resolveImage()
      // turns this into a full URL wherever it's displayed, so the same product
      // record works whether the API runs on localhost, Render, or anywhere else.
      updateVariant(variantIndex, 'images', [...form.variants[variantIndex].images, data.url]);
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <h2 className="font-display text-xl text-forest">{isEdit ? 'Edit Product' : 'Add Product'}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-sm text-charcoal/70">Product Name</label>
          <input required value={form.name} onChange={(e) => updateField('name', e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-charcoal/70">Category</label>
          <select required value={form.category} onChange={(e) => updateField('category', e.target.value)} className="input-field mt-1">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-charcoal/70">Fabric</label>
          <input value={form.fabric} onChange={(e) => updateField('fabric', e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-charcoal/70">Fit</label>
          <select value={form.fit} onChange={(e) => updateField('fit', e.target.value)} className="input-field mt-1">
            {FIT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-charcoal/70">Price (₹)</label>
          <input required type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-charcoal/70">Discount Price (₹, optional)</label>
          <input type="number" value={form.discountPrice} onChange={(e) => updateField('discountPrice', e.target.value)} className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-charcoal/70">Tags (comma separated)</label>
          <input value={form.tags} onChange={(e) => updateField('tags', e.target.value)} className="input-field mt-1" />
        </div>
      </div>

      <div>
        <label className="text-sm text-charcoal/70 block mb-2">Occasion</label>
        <div className="flex flex-wrap gap-2">
          {OCCASION_OPTIONS.map((occ) => (
            <button
              type="button"
              key={occ}
              onClick={() => toggleOccasion(occ)}
              className={`px-3 py-1.5 text-xs border ${form.occasion.includes(occ) ? 'bg-forest text-ivory border-forest' : 'border-charcoal/20'}`}
            >
              {occ}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-charcoal/70">Short Description</label>
        <input value={form.shortDescription} onChange={(e) => updateField('shortDescription', e.target.value)} className="input-field mt-1" />
      </div>
      <div>
        <label className="text-sm text-charcoal/70">Full Description</label>
        <textarea required rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)} className="input-field mt-1" />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => updateField('isFeatured', e.target.checked)} className="accent-forest" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isNewArrival} onChange={(e) => updateField('isNewArrival', e.target.checked)} className="accent-forest" />
          New Arrival
        </label>
      </div>

      {/* Variants */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-charcoal">Variants (Color / Images / Sizes)</h3>
          <button type="button" onClick={addVariant} className="text-sm text-forest underline underline-offset-4">+ Add Variant</button>
        </div>

        <div className="space-y-6">
          {form.variants.map((variant, vi) => (
            <div key={vi} className="border border-charcoal/15 p-4 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-charcoal/60">Color Name</label>
                    <input required value={variant.color} onChange={(e) => updateVariant(vi, 'color', e.target.value)} className="input-field mt-1" placeholder="Emerald Green" />
                  </div>
                  <div>
                    <label className="text-xs text-charcoal/60">Color Swatch</label>
                    <input type="color" value={variant.colorHex} onChange={(e) => updateVariant(vi, 'colorHex', e.target.value)} className="mt-1 w-full h-11 border border-charcoal/20" />
                  </div>
                </div>
                {form.variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(vi)} className="text-red-600 mt-6"><FiTrash2 /></button>
                )}
              </div>

              <div>
                <label className="text-xs text-charcoal/60 block mb-2">Images</label>
                <div className="flex flex-wrap gap-3">
                  {variant.images.map((img, ii) => (
                    <div key={ii} className="relative w-16 h-20">
                      <img src={resolveImage(img)} alt="" className="w-full h-full object-cover border border-charcoal/15" />
                      <button
                        type="button"
                        onClick={() => updateVariant(vi, 'images', variant.images.filter((_, i) => i !== ii))}
                        className="absolute -top-2 -right-2 bg-white rounded-full text-red-600 text-xs w-5 h-5 flex items-center justify-center shadow"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <label className="w-16 h-20 border border-dashed border-charcoal/30 flex flex-col items-center justify-center text-charcoal/40 cursor-pointer hover:border-forest">
                    {uploadingIndex === vi ? <span className="text-xs">...</span> : <FiUploadCloud />}
                    <input type="file" accept="image/*" hidden onChange={(e) => handleImageUpload(vi, e.target.files[0])} />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xs text-charcoal/60 block mb-2">Sizes & Stock</label>
                <div className="space-y-2">
                  {variant.sizes.map((s, si) => (
                    <div key={si} className="flex items-center gap-3">
                      <select value={s.size} onChange={(e) => updateSize(vi, si, 'size', e.target.value)} className="input-field !py-2 w-24">
                        {SIZE_OPTIONS.map((sz) => <option key={sz} value={sz}>{sz}</option>)}
                      </select>
                      <input
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={(e) => updateSize(vi, si, 'stock', Number(e.target.value))}
                        className="input-field !py-2 w-28"
                        placeholder="Stock"
                      />
                      {variant.sizes.length > 1 && (
                        <button type="button" onClick={() => removeSizeRow(vi, si)} className="text-red-600 text-xs">Remove</button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addSizeRow(vi)} className="text-xs text-forest underline underline-offset-4">+ Add size</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Product'}</button>
        <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline">Cancel</button>
      </div>
    </form>
  );
}
