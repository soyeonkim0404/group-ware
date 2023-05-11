import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menu: [],
  version: '',
};

const menuSlice = createSlice({
  name: 'slice/menu',
  initialState,
  reducers: {
    init: (state, action) => {
      return { menu: action.payload, version: Date.now() };
    },
    destroy: (state, action) => {
      return { ...initialState, version: Date.now() };
    },
  },
});

export const { init, destroy } = menuSlice.actions;
export default menuSlice.reducer;
