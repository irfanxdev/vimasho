import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import Motif from '../components/Motif';
import { resolveImage } from '../utils/image';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?featured=true&limit=4'),
      api.get('/products?newArrival=true&limit=4'),
      api.get('/categories'),
    ])
      .then(([f, n, c]) => {
        setFeatured(f.data.products);
        setNewArrivals(n.data.products);
        setCategories(c.data.slice(0, 4));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-forest text-ivory">
        <div className="container-content py-16 sm:py-24 md:py-36 flex flex-col items-center text-center">
          <Motif className="mb-6 opacity-80" />
          <h1 className="text-3xl sm:text-4xl md:text-6xl leading-tight max-w-3xl">
            Tailored for the moments that call for more
          </h1>
          <p className="text-ivory/70 mt-6 max-w-xl text-base md:text-lg">
            Sherwanis, bandhgalas and festive menswear, cut with intention and finished by hand.
          </p>
          <div className="flex w-full max-w-sm flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10">
            <Link to="/products?parent=Wedding" className="btn-gold w-full">Shop Wedding Edit</Link>
            <Link to="/products" className="btn-outline w-full !border-ivory !text-ivory hover:!bg-ivory hover:!text-forest">
              Explore All
            </Link>
          </div>
        </div>
      </section>

      {/* Category strip */}
      {categories.length > 0 && (
        <section className="container-content py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-heading">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link key={cat._id} to={`/products?category=${cat._id}`} className="group relative overflow-hidden">
                <div className="aspect-[3/4] bg-forest/5 flex items-center justify-center">
                  <img
                    src={resolveImage(cat.image) || resolveImage('/catalog/craft-banner.svg')}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span className="absolute bottom-4 left-4 text-ivory text-lg font-display tracking-wide drop-shadow">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container-content py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-heading">The Signature Edit</h2>
            <Link to="/products?featured=true" className="text-sm tracking-wide text-forest underline underline-offset-4 hover:text-gold-dark">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      <div className="container-content"><div className="rule-divider" /></div>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="container-content py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-heading">New Arrivals</h2>
            <Link to="/products?newArrival=true" className="text-sm tracking-wide text-forest underline underline-offset-4 hover:text-gold-dark">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {newArrivals.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Craft banner */}
      <section className="bg-sage/10 py-20 mt-10">
        <div className="container-content grid md:grid-cols-2 gap-10 items-center">
          <img
            src={resolveImage('/catalog/craft-banner.svg')}
            alt="Craftsmanship"
            className="w-full aspect-[4/3] object-cover"
          />
          <div>
            <h2 className="section-heading mb-5">Made with intention</h2>
            <p className="text-charcoal/70 leading-relaxed max-w-md">
              Every VIMASHO piece is finished by hand — from zardozi embroidery to the drape of a stole —
              so it holds up to the weight of the occasion it's made for.
            </p>
            <Link to="/products" className="btn-primary mt-8 inline-flex">Discover the Collection</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
