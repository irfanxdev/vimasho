import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { resolveImage } from '../utils/image';

export default function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted } = useCart();
  const firstVariant = product.variants?.[0];
  const price = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="group relative">
      <Link to={`/products/${product.slug}`} className="block overflow-hidden bg-charcoal/5">
        <img
          src={resolveImage(firstVariant?.images?.[0])}
          alt={product.name}
          loading="lazy"
          className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product._id);
        }}
        aria-label="Toggle wishlist"
        className="absolute top-3 right-3 bg-white/90 rounded-full p-2 text-forest hover:text-gold-dark transition-colors"
      >
        <FiHeart className={isWishlisted(product._id) ? 'fill-current text-gold-dark' : ''} />
      </button>

      <Link to={`/products/${product.slug}`} className="block mt-3">
        <h3 className="text-sm text-charcoal group-hover:text-forest transition-colors leading-snug">{product.name}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-medium text-forest">₹{price.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <span className="text-xs text-charcoal/40 line-through">₹{product.price.toLocaleString('en-IN')}</span>
          )}
        </div>
        <div className="flex gap-1.5 mt-2">
          {product.variants?.map((v) => (
            <span
              key={v.color}
              title={v.color}
              className="w-3.5 h-3.5 rounded-full border border-charcoal/20"
              style={{ backgroundColor: v.colorHex }}
            />
          ))}
        </div>
      </Link>
    </div>
  );
}
