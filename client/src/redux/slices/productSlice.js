// productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await API.get(`/products?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchProduct = createAsyncThunk('product/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await API.get(`/products/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchCategories = createAsyncThunk('product/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/products/categories');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    total: 0,
    pages: 0,
    page: 1,
    currentProduct: null,
    categories: [],
    loading: false,
    error: null,
    filters: { category: '', sort: 'newest', minPrice: '', maxPrice: '', search: '', page: 1 },
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload, page: 1 }; },
    clearCurrentProduct: (state) => { state.currentProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      // fetchProducts
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Guard: ensure we always set arrays, never undefined
        state.products = Array.isArray(action.payload?.products) ? action.payload.products : [];
        state.total    = action.payload?.total  || 0;
        state.pages    = action.payload?.pages  || 0;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading  = false;
        state.error    = action.payload;
        state.products = []; // ← never leave products as undefined
      })

      // fetchProduct
      .addCase(fetchProduct.pending,   (state) => { state.loading = true; state.currentProduct = null; })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading        = false;
        state.currentProduct = action.payload?.product || null;
      })
      .addCase(fetchProduct.rejected,  (state) => { state.loading = false; })

      // fetchCategories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        // API returns { success: true, categories: [...] }
        const cats = action.payload?.categories;
        state.categories = Array.isArray(cats) ? cats : [];
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.categories = []; // ← never leave categories as undefined
      });
  },
});

export const { setFilters, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;

