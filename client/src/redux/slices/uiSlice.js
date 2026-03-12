import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { mobileMenuOpen: false, cartSidebarOpen: false },
  reducers: {
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen; },
    closeMobileMenu: (state) => { state.mobileMenuOpen = false; },
    toggleCartSidebar: (state) => { state.cartSidebarOpen = !state.cartSidebarOpen; },
    closeCartSidebar: (state) => { state.cartSidebarOpen = false; },
  },
});

export const { toggleMobileMenu, closeMobileMenu, toggleCartSidebar, closeCartSidebar } = uiSlice.actions;
export default uiSlice.reducer;
