import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
];

export default function AdminLayout() {
  return (
    <div className="container-content py-10">
      <h1 className="section-heading mb-10">Admin Panel</h1>
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
