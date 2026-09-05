import { Link } from 'react-router-dom';
import Motif from '../components/Motif';

export default function NotFound() {
  return (
    <div className="container-content py-32 text-center">
      <Motif className="mx-auto mb-6" />
      <h1 className="text-5xl font-display text-forest mb-4">404</h1>
      <p className="text-charcoal/60 mb-8">This page doesn't exist, or has been moved.</p>
      <Link to="/" className="btn-primary inline-flex">Back to Home</Link>
    </div>
  );
}
