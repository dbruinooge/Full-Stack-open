import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    changeFilter(state, action) {
      return action.payload;
    }
  },
});

export default filterSlice.reducer;