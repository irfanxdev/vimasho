import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="container-content py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <h1 className="section-heading">Admin Panel</h1>
        <button type="button" onClick={handleLogout} className="btn-outline text-sm">
          Logout
        </button>
      </div>
      <div className="grid md:grid-cols-[200px_1fr] gap-10">
        <aside className="flex md:flex-col gap-4 text-sm flex-wrap">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `pb-1 border-b-2 md:border-b-0 md:border-l-2 md:pl-3 ${
                  isActive ? 'border-gold text-forest font-medium' : 'border-transparent text-charcoal/60 hover:text-forest'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </aside>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
