import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
    isAuthenticated: !!(localStorage.getItem('token') || sessionStorage.getItem('token')),
  },
  reducers: {
    login: (state, action) => {
      const { token, rememberMe } = action.payload;
      state.token = token;
      state.isAuthenticated = true;
      if (rememberMe) {
        localStorage.setItem('token', token);
        sessionStorage.removeItem('token');
      } else {
        sessionStorage.setItem('token', token);
        localStorage.removeItem('token');
      }
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
