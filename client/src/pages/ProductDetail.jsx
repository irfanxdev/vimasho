import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiHeart, FiStar, FiTruck, FiRefreshCw } from 'react-icons/fi';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { resolveImage } from '../utils/image';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data);
        setSelectedColor(data.variants[0]?.color || '');
        setActiveImage(0);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader full />;
  if (!product) return <div className="container-content py-20 text-center">Product not found.</div>;

  const currentVariant = product.variants.find((v) => v.color === selectedColor) || product.variants[0];
  const price = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const selectedSizeStock = currentVariant?.sizes.find((s) => s.size === selectedSize)?.stock ?? null;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    setAdding(true);
    const result = await addToCart(product._id, selectedSize, currentVariant.color, 1);
    setAdding(false);
    if (result?.requiresAuth) {
      navigate('/login', { state: { from: { pathname: `/products/${slug}` } } });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      toast.success('Review submitted');
      const { data } = await api.get(`/products/${slug}`);
      setProduct(data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container-content py-10">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-[3/4] bg-charcoal/5 overflow-hidden">
            <img src={resolveImage(currentVariant.images[activeImage])} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {currentVariant.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {currentVariant.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-20 overflow-hidden border ${activeImage === i ? 'border-gold' : 'border-transparent'}`}
                >
                  <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs tracking-widest text-gold-dark uppercase">{product.category?.name}</p>
          <h1 className="text-3xl font-display text-forest mt-2">{product.name}</h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex text-gold">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar key={star} className={star <= Math.round(product.rating) ? 'fill-current' : ''} />
              ))}
            </div>
            <span className="text-xs text-charcoal/50">({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-2xl text-forest font-medium">₹{price.toLocaleString('en-IN')}</span>
            {hasDiscount && <span className="text-base text-charcoal/40 line-through">₹{product.price.toLocaleString('en-IN')}</span>}
          </div>

          <p className="text-charcoal/70 leading-relaxed mt-5 text-sm max-w-md">{product.shortDescription || product.description}</p>

          {/* Color */}
          <div className="mt-8">
            <p className="text-sm font-medium text-charcoal mb-3">Color: <span className="font-normal text-charcoal/60">{selectedColor}</span></p>
            <div className="flex gap-3">
              {product.variants.map((v) => (
                <button
                  key={v.color}
                  onClick={() => { setSelectedColor(v.color); setSelectedSize(''); setActiveImage(0); }}
                  title={v.color}
                  className={`w-9 h-9 rounded-full border-2 ${selectedColor === v.color ? 'border-gold-dark' : 'border-transparent'}`}
                  style={{ backgroundColor: v.colorHex, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)' }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mt-8">
            <p className="text-sm font-medium text-charcoal mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {currentVariant.sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock < 1}
                  onClick={() => setSelectedSize(s.size)}
                  className={`w-12 h-12 text-sm border transition-colors ${
                    selectedSize === s.size ? 'bg-forest text-ivory border-forest' : 'border-charcoal/20 hover:border-forest'
                  } ${s.stock < 1 ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {selectedSize && selectedSizeStock !== null && selectedSizeStock <= 5 && selectedSizeStock > 0 && (
              <p className="text-xs text-gold-dark mt-2">Only {selectedSizeStock} left in this size</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8">
            <button onClick={handleAddToCart} disabled={adding} className="btn-primary flex-1">
              {adding ? 'Adding...' : 'Add to Bag'}
            </button>
            <button
              onClick={() => toggleWishlist(product._id)}
              className="btn-outline w-14 !px-0"
              aria-label="Toggle wishlist"
            >
              <FiHeart className={isWishlisted(product._id) ? 'fill-current text-gold-dark' : ''} />
            </button>
          </div>

          <div className="flex flex-col gap-3 mt-8 text-sm text-charcoal/60">
            <div className="flex items-center gap-3"><FiTruck /> Free shipping on orders above ₹2,999</div>
            <div className="flex items-center gap-3"><FiRefreshCw /> Easy 7-day exchange</div>
          </div>

          <div className="rule-divider my-8" />

          <div className="text-sm text-charcoal/70 space-y-2">
            <p><span className="font-medium text-charcoal">Fabric:</span> {product.fabric}</p>
            <p><span className="font-medium text-charcoal">Fit:</span> {product.fit}</p>
            <p><span className="font-medium text-charcoal">Occasion:</span> {product.occasion?.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-16 max-w-3xl">
        <h2 className="text-xl font-display text-forest mb-4">Product Details</h2>
        <p className="text-charcoal/70 leading-relaxed">{product.description}</p>
      </div>

      {/* Reviews */}
      <div className="mt-16 max-w-3xl">
        <h2 className="text-xl font-display text-forest mb-6">Customer Reviews</h2>

        {product.reviews.length === 0 && <p className="text-charcoal/50 text-sm mb-6">No reviews yet — be the first to share your experience.</p>}

        <div className="space-y-6 mb-10">
          {product.reviews.map((r) => (
            <div key={r._id} className="border-b border-charcoal/10 pb-5">
              <div className="flex items-center gap-2">
                <div className="flex text-gold text-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar key={star} className={star <= r.rating ? 'fill-current' : ''} />
                  ))}
                </div>
                <span className="text-sm font-medium">{r.name}</span>
              </div>
              <p className="text-charcoal/70 text-sm mt-2">{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your Rating</label>
              <select
                value={reviewForm.rating}
                onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                className="input-field mt-2 max-w-[150px]"
              >
                {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <textarea
              required
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Share your experience with this product..."
              rows={4}
              className="input-field"
            />
            <button type="submit" disabled={submittingReview} className="btn-outline">
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <p className="text-sm text-charcoal/60">
            <button onClick={() => navigate('/login')} className="underline underline-offset-4 text-forest">Sign in</button> to leave a review.
          </p>
        )}
      </div>
    </div>
  );
}
