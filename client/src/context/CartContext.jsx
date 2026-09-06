import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const normalizeCart = (items) =>
  (Array.isArray(items) ? items : []).filter((item) => {
    const quantity = Number(item?.quantity);
    return item?.product && Number.isFinite(quantity) && quantity > 0;
  });

const getProductPrice = (product) => {
  const price = Number(product?.price);
  const discountPrice = Number(product?.discountPrice);
  if (Number.isFinite(discountPrice) && discountPrice > 0 && discountPrice < price) {
    return discountPrice;
  }
  return Number.isFinite(price) ? price : 0;
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart([]);
      return;
    }
    setLoadingCart(true);
    try {
      const { data } = await api.get('/users/cart');
      setCart(normalizeCart(data));
    } catch {
      // silent - user may have stale token
    } finally {
      setLoadingCart(false);
    }
  }, [user]);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      const { data } = await api.get('/users/wishlist');
      setWishlist(data);
    } catch {
      // silent
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
    refreshWishlist();
  }, [user, refreshCart, refreshWishlist]);

  const addToCart = async (productId, size, color, quantity = 1) => {
    if (!user) {
      toast.error('Please sign in to add items to your bag');
      return { requiresAuth: true };
    }
    try {
      const { data } = await api.post('/users/cart', { productId, size, color, quantity });
      setCart(normalizeCart(data));
      toast.success('Added to bag');
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not add to bag');
      return { success: false };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    const { data } = await api.put(`/users/cart/${itemId}`, { quantity });
    setCart(normalizeCart(data));
  };

  const removeCartItem = async (itemId) => {
    const { data } = await api.delete(`/users/cart/${itemId}`);
    setCart(normalizeCart(data));
    toast.success('Removed from bag');
  };

  const clearCart = async () => {
    const { data } = await api.delete('/users/cart');
    setCart(normalizeCart(data));
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Please sign in to save items');
      return;
    }
    const { data } = await api.post(`/users/wishlist/${productId}`);
    setWishlist(data);
  };

  const isWishlisted = (productId) => wishlist.some((p) => p._id === productId);

  const cartCount = cart.length;
  const cartTotal = cart.reduce((sum, item) => {
    const quantity = Number(item.quantity);
    return sum + getProductPrice(item.product) * (Number.isFinite(quantity) ? quantity : 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        loadingCart,
        cartCount,
        cartTotal,
        addToCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        toggleWishlist,
        isWishlisted,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
