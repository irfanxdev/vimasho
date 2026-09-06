import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { resolveImage } from '../utils/image';

export default function Cart() {
  const { cart, loadingCart, updateCartItem, removeCartItem, cartTotal } = useCart();
  const navigate = useNavigate();

  if (loadingCart) return <Loader full />;

  if (cart.length === 0) {
    return (
      <div className="container-content py-24 text-center">
        <h1 className="section-heading mb-4">Your bag is empty</h1>
        <p className="text-charcoal/60 mb-8">Explore the collection and find something worth the occasion.</p>
        <Link to="/products" className="btn-primary inline-flex">Continue Shopping</Link>
      </div>
    );
  }

  const shipping = cartTotal > 2999 ? 0 : 149;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax;

  return (
    <div className="container-content py-10">
      <h1 className="section-heading mb-10">Your Bag ({cart.length})</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-12">
        <div className="space-y-6">
          {cart.map((item) => {
            const product = item.product;
            if (!product) return null;
            const variant = product.variants?.find((v) => v.color === item.color);
            const price = Number(product.discountPrice) > 0 && Number(product.discountPrice) < Number(product.price)
              ? Number(product.discountPrice)
              : Number(product.price) || 0;
            return (
              <div key={item._id} className="flex gap-5 border-b border-charcoal/10 pb-6">
                <Link to={`/products/${product.slug}`} className="w-24 h-32 bg-charcoal/5 shrink-0 overflow-hidden">
                  <img src={resolveImage(variant?.images?.[0])} alt={product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1">
                  <Link to={`/products/${product.slug}`} className="text-sm font-medium text-charcoal hover:text-forest">
                    {product.name}
                  </Link>
                  <p className="text-xs text-charcoal/50 mt-1">Color: {item.color} · Size: {item.size}</p>
                  <p className="text-sm text-forest font-medium mt-2">₹{price.toLocaleString('en-IN')}</p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-charcoal/20">
                      <button
                        onClick={() => updateCartItem(item._id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center hover:bg-charcoal/5"
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-charcoal/5"
                      >
                        <FiPlus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeCartItem(item._id)} className="text-charcoal/40 hover:text-red-600">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-charcoal/5 p-6 h-fit">
          <h2 className="font-display text-xl text-forest mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm text-charcoal/70">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="flex justify-between"><span>Tax (5%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
          </div>
          <div className="rule-divider my-4" />
          <div className="flex justify-between font-medium text-forest text-base">
            <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-6">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
