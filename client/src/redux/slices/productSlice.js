import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

const PRODUCT_CACHE_KEY = 'gr_products_cache_v1';
const CATEGORY_CACHE_KEY = 'gr_categories_cache_v1';

const readCache = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeCache = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const getInitialProducts = () => readCache(PRODUCT_CACHE_KEY, null);
const getInitialCategories = () => readCache(CATEGORY_CACHE_KEY, []);

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/products?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch products');
  }
});

export const fetchProduct = createAsyncThunk('product/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch product');
  }
});

export const fetchCategories = createAsyncThunk('product/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/products/categories');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch categories');
  }
});

const cachedProducts = getInitialProducts();
const cachedCategories = getInitialCategories();

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: Array.isArray(cachedProducts?.products) ? cachedProducts.products : [],
    total: cachedProducts?.total || 0,
    pages: cachedProducts?.pages || 0,
    page: 1,
    currentProduct: null,
    categories: Array.isArray(cachedCategories) ? cachedCategories : [],
    loading: false,
    error: null,
    filters: { category: '', sort: 'newest', minPrice: '', maxPrice: '', search: '', page: 1 },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload?.products) ? action.payload.products : [];
        state.total = action.payload?.total || 0;
        state.pages = action.payload?.pages || 0;

        writeCache(PRODUCT_CACHE_KEY, {
          products: state.products,
          total: state.total,
          pages: state.pages,
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        const fallback = getInitialProducts();
        if (!state.products.length && Array.isArray(fallback?.products)) {
          state.products = fallback.products;
          state.total = fallback.total || fallback.products.length || 0;
          state.pages = fallback.pages || 1;
        }
      })

      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.currentProduct = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload?.product || null;
      })
      .addCase(fetchProduct.rejected, (state) => {
        state.loading = false;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        const cats = action.payload?.categories;
        state.categories = Array.isArray(cats) ? cats : [];
        writeCache(CATEGORY_CACHE_KEY, state.categories);
      })
      .addCase(fetchCategories.rejected, (state) => {
        const fallback = getInitialCategories();
        if (!state.categories.length && Array.isArray(fallback)) {
          state.categories = fallback;
        }
      });
  },
});

export const { setFilters, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
