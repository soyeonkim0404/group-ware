import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  version: '',
};

const authSlice = createSlice({
  name: 'slice/auth',
  initialState,
  reducers: {
    init: (state, action) => {
      return { data: action.payload, version: Date.now() };
    },
    destroy: (state, action) => {
      return { ...initialState, version: Date.now() };
    },
  },
});

export const { init, destroy } = authSlice.actions;
export default authSlice.reducer;
