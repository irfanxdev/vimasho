import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NAV_GROUPS = ['New Arrival', 'Wedding', 'Clothing', 'Accessories'];

export default function Navbar() {
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);
  const searchRef = useRef(null);

  const { user, logout } = useAuth();
  const { cartCount, wishlist } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const groupedCategories = (group) => categories.filter((c) => c.parent === group);

  return (
    <header className="sticky top-0 z-40 bg-ivory/95 border-b border-charcoal/10">
      {/* Top strip */}
      <div className="hidden lg:block bg-forest text-ivory text-xs">
        <div className="container-content flex justify-between items-center py-2">
          <span className="tracking-wide">Complimentary alterations on wedding orders</span>
          <div className="flex gap-6">
            <Link to="/orders" className="hover:text-gold transition-colors">Track Orders</Link>
            <span className="text-ivory/40">|</span>
            <span>INR (₹)</span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-content flex items-center gap-2 py-3 sm:py-4 lg:gap-8">
        <button className="lg:hidden text-forest text-2xl shrink-0" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <FiMenu />
        </button>

        <Link to="/" className="flex shrink-0 flex-col items-center leading-none mx-auto lg:mx-0 min-w-0 max-w-[145px] sm:max-w-none">
          <span className="font-display text-2xl sm:text-3xl tracking-[0.15em] text-forest font-semibold">VIMASHO</span>
          <span className="text-[8px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.35em] text-gold-dark mt-0.5 whitespace-nowrap">MEN&apos;S ETHNIC WEAR</span>
        </Link>

        <nav className="hidden lg:flex flex-1 items-center justify-center gap-5 xl:gap-10">
          {NAV_GROUPS.map((group) => (
            <div
              key={group}
              className="relative"
              onMouseEnter={() => setActiveGroup(group)}
              onMouseLeave={() => setActiveGroup(null)}
            >
              <Link
                to={`/products?parent=${encodeURIComponent(group)}`}
                className="text-sm tracking-wide text-charcoal hover:text-forest transition-colors py-2"
              >
                {group}
              </Link>
              {activeGroup === group && groupedCategories(group).length > 0 && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white shadow-lg border border-charcoal/10 min-w-[200px] py-2 z-50">
                  {groupedCategories(group).map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/products?category=${cat._id}`}
                      className="block px-5 py-2 text-sm text-charcoal hover:bg-ivory hover:text-forest"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-5 lg:gap-6 text-forest text-lg">
          <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="hover:text-gold-dark transition-colors">
            <FiSearch />
          </button>
          <Link to="/wishlist" aria-label="Wishlist" className="relative hidden sm:inline-flex hover:text-gold-dark transition-colors">
            <FiHeart />
            {wishlist?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-forest-dark text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-sans">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to={user ? '/account' : '/login'} aria-label="Account" className="hidden sm:inline-flex hover:text-gold-dark transition-colors">
            <FiUser />
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="hidden lg:inline-flex text-xs tracking-wide hover:text-gold-dark transition-colors">
              Admin Panel
            </Link>
          )}
          <Link to="/cart" aria-label="Shopping bag" className="relative hover:text-gold-dark transition-colors">
            <FiShoppingBag />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-forest-dark text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-sans">
                {cartCount}
              </span>
            )}
          </Link>
          {user && (
            <button onClick={logout} className="hidden md:inline text-xs tracking-wide underline underline-offset-4 hover:text-gold-dark">
              Sign out
            </button>
          )}
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-charcoal/10 bg-white">
          <form onSubmit={handleSearch} className="container-content py-3 flex items-center gap-3">
            <FiSearch className="text-charcoal/50" />
            <input
              ref={searchRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sherwanis, bandhgalas, kurta sets..."
              className="flex-1 outline-none text-sm py-1 bg-transparent"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="text-charcoal/50">
              <FiX />
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed left-0 top-0 z-[100] flex h-[100dvh] min-h-screen w-screen max-w-none flex-col overflow-hidden bg-forest text-ivory">
          <div className="flex items-center justify-between px-5 py-4 sm:px-6 border-b border-gold/30">
            <div>
              <span className="font-display text-2xl tracking-[0.18em]">VIMASHO</span>
              <span className="block text-[9px] tracking-[0.28em] text-gold-light mt-1">MEN&apos;S ETHNIC WEAR</span>
            </div>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="rounded-full border border-ivory/20 p-2 text-xl leading-none transition-colors hover:bg-ivory/10">
              <FiX />
            </button>
          </div>
          <nav className="flex flex-1 min-h-0 flex-col gap-3 overflow-y-auto overscroll-contain p-4 sm:p-6">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-lg bg-ivory/10 px-4 py-3 text-base font-medium tracking-wide transition-colors hover:bg-ivory/15">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="rounded-lg bg-ivory/10 px-4 py-3 text-base font-medium tracking-wide transition-colors hover:bg-ivory/15">
              All Products
            </Link>
            <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="rounded-lg bg-ivory/10 px-4 py-3 text-base font-medium tracking-wide transition-colors hover:bg-ivory/15">
              Wishlist
            </Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="rounded-lg bg-ivory/10 px-4 py-3 text-base font-medium tracking-wide transition-colors hover:bg-ivory/15">
              Shopping Bag
            </Link>
            {NAV_GROUPS.map((group) => (
              <div key={group} className="rounded-lg border border-ivory/15 px-4 py-3">
                <Link
                  to={`/products?parent=${encodeURIComponent(group)}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-base font-medium tracking-wide"
                >
                  {group}
                </Link>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                  {groupedCategories(group).map((cat) => (
                    <Link
                      key={cat._id}
                      to={`/products?category=${cat._id}`}
                      onClick={() => setMobileOpen(false)}
                      className="text-xs text-ivory/60 break-words hover:text-gold-light"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="rule-divider my-2" />
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="rounded-lg border border-gold/50 px-4 py-3 text-gold-light">Admin Panel</Link>
                )}
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="rounded-lg border border-ivory/15 px-4 py-3">My Orders</Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="rounded-lg border border-ivory/15 px-4 py-3">Track Order</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-lg border border-ivory/15 px-4 py-3 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="rounded-lg border border-ivory/15 px-4 py-3">My Orders</Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="rounded-lg border border-ivory/15 px-4 py-3">Track Order</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg border border-gold/50 px-4 py-3 text-gold-light">Sign in</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
