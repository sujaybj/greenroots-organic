import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Search, SlidersHorizontal, X, Leaf } from 'lucide-react';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import BackNav from '../components/common/BackNav';

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Dairy', 'Grains', 'Pulses', 'Spices', 'Oils', 'Beverages', 'Skincare', 'Electronics', 'Household'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, total, pages, error } = useSelector(s => s.product);
  const [localFilters, setLocalFilters] = useState({
    category: searchParams.get('category') || '',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
    search: searchParams.get('search') || '',
    page: 1,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const hasProducts = products.length > 0;

  const applyFilters = useCallback((f) => {
    const params = {};
    if (f.category) params.category = f.category;
    if (f.search) params.search = f.search;
    setSearchParams(params);
    dispatch(fetchProducts({ ...f, limit: 12 }));
  }, [dispatch, setSearchParams]);

  useEffect(() => {
    applyFilters(localFilters);
  }, [localFilters]);

  const setFilter = (key, value) => setLocalFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  const clearAll = () => setLocalFilters({ category: '', sort: 'newest', minPrice: '', maxPrice: '', search: '', page: 1 });

  return (
    <>
      <Helmet><title>Shop Organic Products - GreenRoots</title></Helmet>
      <div className="container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
        <div style={{ marginBottom: '10px' }}>
          <BackNav label="Back" fallback="/" />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: 'clamp(1.4rem,4vw,2rem)' }}>Organic Products</h1>
          <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '0.88rem' }}>{total} products found</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
            <Search size={15} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search products..."
              value={localFilters.search}
              style={{ paddingLeft: '40px' }}
              onChange={e => setFilter('search', e.target.value)}
            />
          </div>
          <select className="form-input" style={{ width: 'auto', minWidth: '160px' }} value={localFilters.sort} onChange={e => setFilter('sort', e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setFilterOpen(!filterOpen)} className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            {filterOpen ? <><X size={14} /> Close</> : <><SlidersHorizontal size={14} /> Filters</>}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter('category', cat === 'All' ? '' : cat)}
              style={{
                padding: '7px 16px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, flexShrink: 0, transition: 'all 0.2s',
                background: (cat === 'All' ? !localFilters.category : localFilters.category === cat) ? '#2D6A4F' : '#F3F4F6',
                color: (cat === 'All' ? !localFilters.category : localFilters.category === cat) ? 'white' : '#374151',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {filterOpen && (
          <div style={{ background: 'white', borderRadius: '12px', padding: 'clamp(14px,3vw,20px)', marginBottom: '18px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
            {[['minPrice', 'Min Price (₹)', '0'], ['maxPrice', 'Max Price (₹)', '5000']].map(([key, label, ph]) => (
              <div key={key} style={{ flex: 1, minWidth: '130px' }}>
                <label className="form-label">{label}</label>
                <input type="number" className="form-input" placeholder={ph} value={localFilters[key]} onChange={e => setFilter(key, e.target.value)} />
              </div>
            ))}
            <div style={{ flex: 1, minWidth: '130px' }}>
              <label className="form-label">Min Rating</label>
              <select className="form-input" value={localFilters.rating || ''} onChange={e => setFilter('rating', e.target.value)}>
                <option value="">Any Rating</option>
                {[4, 3, 2, 1].map(r => <option key={r} value={r}>{r}+ Stars</option>)}
              </select>
            </div>
            <button onClick={clearAll} className="btn btn-outline btn-sm">Clear All</button>
          </div>
        )}

        {loading && !hasProducts ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}><Loader size={48} /></div>
        ) : error && !hasProducts ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Leaf size={56} color="#2D6A4F" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#374151' }}>Could not load products</h3>
            <p style={{ color: '#9CA3AF', marginTop: '8px' }}>{error}</p>
            <button onClick={() => applyFilters(localFilters)} className="btn btn-primary" style={{ marginTop: '16px' }}>Retry</button>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Leaf size={56} color="#2D6A4F" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#374151' }}>No products found</h3>
            <p style={{ color: '#9CA3AF', marginTop: '8px' }}>Try adjusting your filters or search term</p>
            <button onClick={clearAll} className="btn btn-primary" style={{ marginTop: '16px' }}>Clear Filters</button>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '12px', background: '#FFF7ED', border: '1px solid #FED7AA', color: '#9A3412', fontSize: '0.9rem' }}>
                Showing your last loaded products while the network reconnects.
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,190px),1fr))', gap: 'clamp(10px,2vw,20px)' }}>
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </>
        )}

        {pages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '40px', flexWrap: 'wrap' }}>
            <button onClick={() => setLocalFilters(p => ({ ...p, page: p.page - 1 }))} disabled={localFilters.page === 1} className="btn btn-outline btn-sm">Prev</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => { setLocalFilters(prev => ({ ...prev, page: p })); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                style={{ width: '36px', height: '36px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', background: p === localFilters.page ? '#2D6A4F' : '#F3F4F6', color: p === localFilters.page ? 'white' : '#374151' }}
              >
                {p}
              </button>
            ))}
            <button onClick={() => setLocalFilters(p => ({ ...p, page: p.page + 1 }))} disabled={localFilters.page === pages} className="btn btn-outline btn-sm">Next</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
