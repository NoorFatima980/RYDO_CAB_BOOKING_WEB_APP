import { createSlice } from '@reduxjs/toolkit';

const popupSlice = createSlice({
  name: 'popup',
  initialState: {
    show: false,
    message: '',
    type: 'success' // success, error, warning, info
  },
  reducers: {
    showPopup: (state, action) => {
      state.show = true;
      state.message = action.payload.message;
      state.type = action.payload.type || 'success';
    },
    hidePopup: (state) => {
      state.show = false;
      state.message = '';
      state.type = 'success';
    }
  }
});

export const { showPopup, hidePopup } = popupSlice.actions;
export default popupSlice.reducer;