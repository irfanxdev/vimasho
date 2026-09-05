import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Motif from '../components/Motif';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-content py-16 md:py-24 flex justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Motif className="mx-auto mb-4" />
          <h1 className="text-2xl font-display text-forest">Sign In</h1>
          <p className="text-sm text-charcoal/60 mt-2">Welcome back to VIMASHO</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-charcoal/70">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field mt-1" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm text-charcoal/70">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field mt-1" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-charcoal/60 mt-8">
          New to VIMASHO? <Link to="/register" className="text-forest underline underline-offset-4">Create an account</Link>
        </p>

        <p className="text-center text-xs text-charcoal/40 mt-6">
          Demo login: demo@vimasho.com / Demo@12345
        </p>
      </div>
    </div>
  );
}
