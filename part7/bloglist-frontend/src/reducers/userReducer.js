import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import { setNotification } from './notificationReducer';

const initialState = {};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return {
        username: action.payload.username,
        token: action.payload.token,
      }
    },
    unsetUser(state, action) {
      return {};
    },    
  },
});

export const { setUser, unsetUser } = userSlice.actions;

export const login = (credentials) => {
  return async (dispatch) => {
    try {
      const loggedUser = await loginService.login(credentials);
      dispatch(setUser(loggedUser));
      window.localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
    } catch (exception) {
      dispatch(setNotification('Wrong credentials', 5));
    }
    
  };
};

export const logout = () => {
  return async (dispatch) => {
    dispatch(unsetUser());
    window.localStorage.removeItem("loggedUser");
  };
};

export const restoreUser = (loggedUser) => {
  return async (dispatch) => {
    dispatch(setUser(loggedUser));
  }
}

export const setToken = (token) => {
  // return async (dispatch) => {
  //   await blogService.remove(blog);
  //   dispatch(deleteBlog(blog));
  // }
}


export default userSlice.reducer;