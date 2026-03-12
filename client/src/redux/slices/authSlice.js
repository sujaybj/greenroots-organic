// ─── client/src/redux/slices/authSlice.js ───────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api';
import toast from 'react-hot-toast';

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/register', data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/verify-otp', data);
    localStorage.setItem('accessToken', res.data.accessToken);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'OTP verification failed');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await API.post('/auth/login', data);
    localStorage.setItem('accessToken', res.data.accessToken);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await API.post('/auth/logout');
  localStorage.removeItem('accessToken');
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await API.get('/auth/me');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (formData, { rejectWithValue }) => {
  try {
    const res = await API.put('/user/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    pendingUserId: null,
    requiresVerification: false,
  },
  reducers: {
    clearError:              (state)         => { state.error = null; },
    setPendingUser:          (state, action) => { state.pendingUserId = action.payload; },
    setRequiresVerification: (state, action) => { state.requiresVerification = action.payload; },
    updateWishlist:          (state, action) => { if (state.user) state.user.wishlist = action.payload; },

    // ── NEW: Called by GoogleSuccess page after OAuth redirect ──
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user            = user;
      state.accessToken     = token;
      state.isAuthenticated = true;
      state.loading         = false;
      localStorage.setItem('accessToken', token);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingUserId = action.payload.userId;
        // Show WhatsApp/email notice
        toast.success(action.payload.message || 'OTP sent! Check your email & WhatsApp.');
      })
      .addCase(registerUser.rejected,  (state, action) => { state.loading = false; state.error = action.payload; toast.error(action.payload); })

      // Verify OTP
      .addCase(verifyOTP.pending,   (state) => { state.loading = true; })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user;
        state.accessToken = action.payload.accessToken; state.isAuthenticated = true;
        state.pendingUserId = null;
        toast.success('Verified! Welcome to GreenRoots 🌿');
      })
      .addCase(verifyOTP.rejected,  (state, action) => { state.loading = false; state.error = action.payload; toast.error(action.payload); })

      // Login
      .addCase(loginUser.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user;
        state.accessToken = action.payload.accessToken; state.isAuthenticated = true;
        toast.success(`Welcome back, ${action.payload.user.name.split(' ')[0]}! 🌿`);
      })
      .addCase(loginUser.rejected,  (state, action) => {
        state.loading = false;
        if (action.payload?.requiresVerification) {
          state.requiresVerification = true;
          state.pendingUserId = action.payload.userId;
        }
        state.error = action.payload?.message || 'Login failed';
        toast.error(state.error);
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null; state.accessToken = null;
        state.isAuthenticated = false;
        toast.success('Logged out successfully');
      })

      // Get Me
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null; state.isAuthenticated = false; state.accessToken = null;
      })

      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        toast.success('Profile updated successfully');
      });
  },
});

export const { clearError, setPendingUser, setRequiresVerification, updateWishlist, setCredentials } = authSlice.actions;
export default authSlice.reducer;
