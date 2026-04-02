import { createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    coupon: null,
    discount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find(item => item.product === product._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock || 10);
        toast.success('Cart updated!');
      } else {
        state.items.push({
          product: product._id,
          name: product.name,
          price: product.discountPrice || product.price,
          originalPrice: product.price,
          image: product.images?.[0]?.url,
          unit: product.unit,
          stock: product.stock,
          quantity,
        });
        toast.success(`${product.name} added to cart`);
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.product !== action.payload);
      toast.success('Item removed from cart');
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(i => i.product === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(i => i.product !== productId);
        } else {
          item.quantity = Math.min(quantity, item.stock || 10);
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.couponCode;
      state.discount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
      toast.success('Coupon removed');
    },
  },
});

// Selectors
export const selectCartItems = state => state.cart.items;
export const selectCartCount = state => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = state => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartDiscount = state => state.cart.discount;
export const selectCartCoupon = state => state.cart.coupon;
export const selectCartTotal = state => {
  const subtotal = selectCartSubtotal(state);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round(subtotal * 0.05);
  return subtotal + shipping + tax - state.cart.discount;
};

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;
