import { createSlice } from '@reduxjs/toolkit';

const initialState = { timeout: null, message: 'Initial notification' };

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification(state, action) {
      return action.payload;
    },
    removeNotification(state, action) {
      return {
        ...state,
        message: '',
      };
    }
  },
});

export const { addNotification, removeNotification } = notificationSlice.actions;

export const setNotification = (content, seconds) => {
  return async (dispatch, getState) => {
    const prevTimeout = getState().notification.timeout;
    clearTimeout(prevTimeout);

    const newTimeout = setTimeout(() => {
      dispatch(removeNotification());
    }, seconds * 1000);
    
    dispatch(addNotification({ timeout: newTimeout, message: content }));
  }
}


export default notificationSlice.reducer;