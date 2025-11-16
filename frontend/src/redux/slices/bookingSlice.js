import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Async thunks
export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Booking failed');
    }
  }
);

export const getUserBookings = createAsyncThunk(
  'booking/getUserBookings',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await api.get(`/bookings/my-bookings?page=${page}&limit=10`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Cancellation failed');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    currentBooking: null,
    bookings: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    },
    isLoading: false,
    error: null
  },
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBooking = action.payload.data.booking;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get user bookings
      .addCase(getUserBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.data.bookings;
        state.pagination = action.payload.data.pagination;
        state.error = null;
      })
      .addCase(getUserBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const cancelledBooking = action.payload.data.booking;
        state.bookings = state.bookings.map(booking =>
          booking._id === cancelledBooking._id ? cancelledBooking : booking
        );
        if (state.currentBooking && state.currentBooking._id === cancelledBooking._id) {
          state.currentBooking = cancelledBooking;
        }
      });
  }
});

export const { clearCurrentBooking, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;