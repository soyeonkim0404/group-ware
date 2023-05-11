import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  name: null,
  profileImage: null,
  position: null,
  part: null,
  isLogin: false,
  sub: null,
};

const profileSlice = createSlice({
  name: 'slice/profile',
  initialState,
  reducers: {
    login: (state, action) => {
      return { ...action.payload, isLogin: true };
    },
    logout: (state, action) => {
      return { ...initialState };
    },
  },
});

export const { login, logout } = profileSlice.actions;
export default profileSlice.reducer;
