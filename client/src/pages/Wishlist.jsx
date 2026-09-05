import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { wishlist } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="container-content py-24 text-center">
        <h1 className="section-heading mb-4">Your wishlist is empty</h1>
        <p className="text-charcoal/60 mb-8">Save pieces you love and come back to them anytime.</p>
        <Link to="/products" className="btn-primary inline-flex">Explore Collection</Link>
      </div>
    );
  }

  return (
    <div className="container-content py-10">
      <h1 className="section-heading mb-10">Your Wishlist ({wishlist.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {wishlist.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
