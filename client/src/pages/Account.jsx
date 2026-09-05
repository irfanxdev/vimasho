import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({ name: '', phone: '', password: '' });
  const [addresses, setAddresses] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/auth/me').then(({ data }) => {
      setProfile({ name: data.name, phone: data.phone || '', password: '' });
      setAddresses(data.addresses || []);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: profile.name, phone: profile.phone };
      if (profile.password) payload.password = profile.password;
      await updateProfile(payload);
      toast.success('Profile updated');
      setProfile({ ...profile, password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    const { data } = await api.delete(`/auth/me/addresses/${id}`);
    setAddresses(data);
    toast.success('Address removed');
  };

  return (
    <div className="container-content py-10">
      <h1 className="section-heading mb-10">My Account</h1>
      <div className="grid md:grid-cols-[220px_1fr] gap-12">
        <aside className="flex md:flex-col gap-4 text-sm">
          <span className="font-medium text-forest">Profile</span>
          <Link to="/orders" className="text-charcoal/60 hover:text-forest">Orders</Link>
          <Link to="/wishlist" className="text-charcoal/60 hover:text-forest">Wishlist</Link>
        </aside>

        <div className="max-w-lg space-y-12">
          <section>
            <h2 className="font-display text-xl text-forest mb-5">Profile Details</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm text-charcoal/70">Full Name</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input-field mt-1" />
              </div>
              <div>
                <label className="text-sm text-charcoal/70">Email</label>
                <input value={user?.email} disabled className="input-field mt-1 opacity-60" />
              </div>
              <div>
                <label className="text-sm text-charcoal/70">Phone</label>
                <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input-field mt-1" />
              </div>
              <div>
                <label className="text-sm text-charcoal/70">New Password (leave blank to keep current)</label>
                <input type="password" value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} className="input-field mt-1" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
            </form>
          </section>

          <section>
            <h2 className="font-display text-xl text-forest mb-5">Saved Addresses</h2>
            {addresses.length === 0 ? (
              <p className="text-sm text-charcoal/50">No addresses saved yet. You can add one at checkout.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr._id} className="border border-charcoal/15 p-4 text-sm flex justify-between items-start">
                    <div>
                      <span className="font-medium">{addr.fullName}</span> · {addr.phone}
                      <div className="text-charcoal/60 mt-1">
                        {addr.line1}, {addr.line2 ? `${addr.line2}, ` : ''}{addr.city}, {addr.state} {addr.postalCode}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteAddress(addr._id)} className="text-xs text-red-600 underline underline-offset-4">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
