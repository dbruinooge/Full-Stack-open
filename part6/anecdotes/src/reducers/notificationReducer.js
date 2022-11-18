// create a separate reducer for the new functionality using the Redux Toolkit's createSlice function
// then, refactor the application to use a combined reducer

import { createSlice } from '@reduxjs/toolkit';

const initialState = { timeout: null, message: 'Initial notification' };

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action) {
      return {
        timeout: action.payload.timeout,
        message: action.payload.message,
      }
    },
    removeNotification(state, action) {
      return {
        ...state,
        message: '',
      };
    }
  },
});

// export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;