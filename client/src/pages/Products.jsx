import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const FIT_OPTIONS = ['Slim', 'Regular', 'Relaxed', 'Classic'];
const OCCASION_OPTIONS = ['Wedding', 'Festive', 'Sangeet', 'Reception', 'Casual', 'Formal', 'Haldi'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
];

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-charcoal/10 py-5">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-sm font-medium text-charcoal">
        {title}
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {open && <div className="mt-4 space-y-2">{children}</div>}
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [facets, setFacets] = useState({ colors: [], sizes: [], priceRange: { min: 0, max: 50000 } });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const parent = searchParams.get('parent') || '';
  const categoryParam = searchParams.get('category') || '';
  const fitParam = searchParams.get('fit') || '';
  const occasionParam = searchParams.get('occasion') || '';
  const sizeParam = searchParams.get('size') || '';
  const colorParam = searchParams.get('color') || '';
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || 'newest';
  const featured = searchParams.get('featured') || '';
  const newArrival = searchParams.get('newArrival') || '';

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data));
    api.get('/products/facets').then(({ data }) => setFacets(data));
  }, []);

  const visibleCategories = useMemo(() => {
    if (!parent) return categories;
    return categories.filter((c) => c.parent === parent);
  }, [categories, parent]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoryParam) params.set('category', categoryParam);
    if (fitParam) params.set('fit', fitParam);
    if (occasionParam) params.set('occasion', occasionParam);
    if (sizeParam) params.set('size', sizeParam);
    if (colorParam) params.set('color', colorParam);
    if (keyword) params.set('keyword', keyword);
    if (featured) params.set('featured', featured);
    if (newArrival) params.set('newArrival', newArrival);
    params.set('sort', sort);
    params.set('page', page);
    params.set('limit', 12);

    // If filtering by parent group without a specific category, resolve to category ids client-side
    if (parent && !categoryParam && categories.length) {
      const ids = categories.filter((c) => c.parent === parent).map((c) => c._id);
      if (ids.length) params.set('category', ids.join(','));
    }

    api
      .get(`/products?${params.toString()}`)
      .then(({ data }) => {
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam, fitParam, occasionParam, sizeParam, colorParam, keyword, sort, page, featured, newArrival, parent, categories.length]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setPage(1);
    setSearchParams(next);
  };

  const toggleMultiParam = (key, value) => {
    const current = (searchParams.get(key) || '').split(',').filter(Boolean);
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    updateParam(key, next.join(','));
  };

  const isChecked = (key, value) => (searchParams.get(key) || '').split(',').includes(value);

  const clearAll = () => {
    setSearchParams({});
    setPage(1);
  };

  const activeFilterChips = [
    categoryParam && { key: 'category', label: categories.find((c) => c._id === categoryParam)?.name || 'Category' },
    ...fitParam.split(',').filter(Boolean).map((v) => ({ key: 'fit', value: v, label: v })),
    ...occasionParam.split(',').filter(Boolean).map((v) => ({ key: 'occasion', value: v, label: v })),
    ...sizeParam.split(',').filter(Boolean).map((v) => ({ key: 'size', value: v, label: v })),
    ...colorParam.split(',').filter(Boolean).map((v) => ({ key: 'color', value: v, label: v })),
  ].filter(Boolean);

  const FilterPanel = (
    <div>
      <FilterSection title="Category">
        {visibleCategories.map((cat) => (
          <label key={cat._id} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={categoryParam === cat._id}
              onChange={() => updateParam('category', cat._id)}
              className="accent-forest"
            />
            {cat.name}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Fit">
        {FIT_OPTIONS.map((fit) => (
          <label key={fit} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
            <input type="checkbox" checked={isChecked('fit', fit)} onChange={() => toggleMultiParam('fit', fit)} className="accent-forest" />
            {fit}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Occasion">
        {OCCASION_OPTIONS.map((occ) => (
          <label key={occ} className="flex items-center gap-2 text-sm text-charcoal/80 cursor-pointer">
            <input type="checkbox" checked={isChecked('occasion', occ)} onChange={() => toggleMultiParam('occasion', occ)} className="accent-forest" />
            {occ}
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {facets.sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleMultiParam('size', size)}
              className={`w-10 h-10 text-xs border transition-colors ${
                isChecked('size', size) ? 'bg-forest text-ivory border-forest' : 'border-charcoal/20 text-charcoal hover:border-forest'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Color">
        <div className="flex flex-wrap gap-3">
          {facets.colors.map((color) => (
            <button
              key={color}
              onClick={() => toggleMultiParam('color', color)}
              title={color}
              className={`w-7 h-7 rounded-full border-2 ${isChecked('color', color) ? 'border-gold-dark' : 'border-transparent'}`}
              style={{ backgroundColor: '#ccc', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.15)' }}
            >
              <span className="sr-only">{color}</span>
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="container-content py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-heading">
          {parent || (categoryParam && categories.find((c) => c._id === categoryParam)?.name) || 'All Products'}
        </h1>
        <p className="text-sm text-charcoal/50 hidden md:block">{total} products</p>
      </div>

      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {activeFilterChips.map((chip, i) => (
            <span key={i} className="flex items-center gap-1 bg-charcoal/5 text-xs px-3 py-1.5 rounded-full">
              {chip.label}
              <button onClick={() => (chip.key === 'category' ? updateParam('category', '') : toggleMultiParam(chip.key, chip.value))}>
                <FiX className="text-charcoal/60" />
              </button>
            </span>
          ))}
          <button onClick={clearAll} className="text-xs underline underline-offset-4 text-forest">Clear All</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 border-y border-charcoal/10 py-3">
        <button onClick={() => setMobileFiltersOpen(true)} className="md:hidden text-sm font-medium">Filters</button>
        <span className="hidden md:block" />
        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="text-sm border-none bg-transparent focus:outline-none cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-10">
        <aside className="hidden md:block">{FilterPanel}</aside>

        <div>
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-charcoal/50">
              No products match these filters yet — try clearing a few.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-14">
              {Array.from({ length: pages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`w-9 h-9 text-sm border ${page === num ? 'bg-forest text-ivory border-forest' : 'border-charcoal/20 hover:border-forest'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:hidden">
          <div className="flex items-center justify-between p-5 border-b border-charcoal/10">
            <span className="font-medium">Filters</span>
            <button onClick={() => setMobileFiltersOpen(false)}><FiX className="text-xl" /></button>
          </div>
          <div className="p-5 overflow-y-auto flex-1">{FilterPanel}</div>
          <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary m-5">Show {total} results</button>
        </div>
      )}
    </div>
  );
}
