import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const emptyAddress = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India' };

export default function Checkout() {
  const { cart, cartTotal, clearCart, loadingCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      setAddresses(data.addresses || []);
      const def = (data.addresses || []).find((a) => a.isDefault);
      if (def) setSelectedAddressId(def._id);
      else if (data.addresses?.length) setSelectedAddressId(data.addresses[0]._id);
      else setShowNewAddress(true);
    });
  }, []);

  useEffect(() => {
    if (!loadingCart && cart.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cart.length, loadingCart, navigate]);

  if (loadingCart) return <Loader full />;
  if (cart.length === 0) return null;

  const shipping = cartTotal > 2999 ? 0 : 149;
  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + shipping + tax;

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/me/addresses', newAddress);
      setAddresses(data);
      setSelectedAddressId(data[data.length - 1]._id);
      setShowNewAddress(false);
      setNewAddress(emptyAddress);
      toast.success('Address saved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save address');
    }
  };

  const handlePlaceOrder = async () => {
    const address = addresses.find((a) => a._id === selectedAddressId);
    if (!address) {
      toast.error('Please select or add a shipping address');
      return;
    }

    setPlacingOrder(true);
    try {
      // 1. Create the order in our DB (server verifies price & stock)
      const orderItems = cart.map((item) => ({
        product: item.product._id,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      const { data: order } = await api.post('/orders', {
        orderItems,
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
        paymentMethod: 'razorpay',
      });

      // 2. Create a Razorpay order for this internal order
      const { data: rpOrder } = await api.post('/payment/razorpay/order', { orderId: order._id });

      // 3. Load Razorpay checkout script and open payment modal
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Could not load payment gateway. Please check your connection.');
        setPlacingOrder(false);
        return;
      }

      const options = {
        key: rpOrder.keyId,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: 'VIMASHO',
        description: "Men's Ethnic Wear Order",
        order_id: rpOrder.razorpayOrderId,
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: address.phone,
        },
        theme: { color: '#0F2A1D' },
        handler: async (response) => {
          try {
            await api.post('/payment/razorpay/verify', {
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await clearCart();
            toast.success('Payment successful');
            navigate(`/order-success/${order._id}`);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed. Contact support with your order id.');
            setPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => setPlacingOrder(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setPlacingOrder(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order. Please try again.');
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container-content py-10">
      <h1 className="section-heading mb-10">Checkout</h1>
      <div className="grid md:grid-cols-[1fr_360px] gap-12">
        <div>
          <h2 className="font-display text-xl text-forest mb-5">Shipping Address</h2>

          <div className="space-y-3 mb-6">
            {addresses.map((addr) => (
              <label
                key={addr._id}
                className={`block border p-4 cursor-pointer text-sm ${
                  selectedAddressId === addr._id ? 'border-gold bg-gold/5' : 'border-charcoal/15'
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mr-3 accent-forest"
                  checked={selectedAddressId === addr._id}
                  onChange={() => setSelectedAddressId(addr._id)}
                />
                <span className="font-medium">{addr.fullName}</span> · {addr.phone}
                <div className="text-charcoal/60 mt-1 ml-6">
                  {addr.line1}, {addr.line2 ? `${addr.line2}, ` : ''}{addr.city}, {addr.state} {addr.postalCode}
                </div>
              </label>
            ))}
          </div>

          {!showNewAddress ? (
            <button onClick={() => setShowNewAddress(true)} className="text-sm text-forest underline underline-offset-4">
              + Add a new address
            </button>
          ) : (
            <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-charcoal/15 p-4 sm:p-5">
              <input required placeholder="Full Name" className="input-field col-span-2" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
              <input required placeholder="Phone" className="input-field col-span-2" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
              <input required placeholder="Address Line 1" className="input-field col-span-2" value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
              <input placeholder="Address Line 2 (optional)" className="input-field col-span-2" value={newAddress.line2} onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} />
              <input required placeholder="City" className="input-field" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
              <input required placeholder="State" className="input-field" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
              <input required placeholder="Postal Code" className="input-field" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
              <input required placeholder="Country" className="input-field" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                <button type="submit" className="btn-primary">Save Address</button>
                {addresses.length > 0 && (
                  <button type="button" onClick={() => setShowNewAddress(false)} className="btn-outline">Cancel</button>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="bg-charcoal/5 p-6 h-fit">
          <h2 className="font-display text-xl text-forest mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm max-h-64 overflow-y-auto mb-4">
            {cart.map((item) => (
              <div key={item._id} className="flex justify-between text-charcoal/70">
                <span>{item.product?.name} × {item.quantity}</span>
                <span>
                  ₹{(
                    (Number(item.product?.discountPrice) > 0 &&
                    Number(item.product?.discountPrice) < Number(item.product?.price)
                      ? Number(item.product.discountPrice)
                      : Number(item.product?.price) || 0) *
                    (Number(item.quantity) || 0)
                  ).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <div className="rule-divider my-4" />
          <div className="space-y-2 text-sm text-charcoal/70">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
            <div className="flex justify-between"><span>Tax (5%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
          </div>
          <div className="rule-divider my-4" />
          <div className="flex justify-between font-medium text-forest text-base mb-6">
            <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button onClick={handlePlaceOrder} disabled={placingOrder} className="btn-gold w-full">
            {placingOrder ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
          </button>
          <p className="text-xs text-charcoal/40 mt-3 text-center">Secured by Razorpay</p>
        </div>
      </div>
    </div>
  );
}
