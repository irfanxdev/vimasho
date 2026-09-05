import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Motif from '../components/Motif';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-content py-16 md:py-24 flex justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Motif className="mx-auto mb-4" />
          <h1 className="text-2xl font-display text-forest">Create Account</h1>
          <p className="text-sm text-charcoal/60 mt-2">Join VIMASHO for a tailored experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-charcoal/70">Full Name</label>
            <input name="name" required value={form.name} onChange={handleChange} className="input-field mt-1" placeholder="Aarav Sharma" />
          </div>
          <div>
            <label className="text-sm text-charcoal/70">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange} className="input-field mt-1" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm text-charcoal/70">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input-field mt-1" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="text-sm text-charcoal/70">Password</label>
            <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange} className="input-field mt-1" placeholder="At least 6 characters" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-charcoal/60 mt-8">
          Already have an account? <Link to="/login" className="text-forest underline underline-offset-4">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
