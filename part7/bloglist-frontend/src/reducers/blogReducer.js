import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const initialState = [];

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    like(state, action) {
      const targetBlog = action.payload;
      const updatedBlog = {
        ...targetBlog,
        likes: targetBlog.likes + 1,
      }

      return state.map(blog => blog.id === targetBlog.id ? updatedBlog : blog);
    },
    deleteBlog(state, action) {
      const targetBlog = state.find(blog => blog.id === action.payload.id);
      return state.filter(blog => blog.id !== targetBlog.id);
    },
    appendBlog(state, action) {
      state.push(action.payload);
    }
  },
});

export const { setBlogs, voteBlog, deleteBlog, appendBlog, like } = blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.createNew(blog);
    dispatch(appendBlog(newBlog));
  };
};

export const removeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog);
    dispatch(deleteBlog(blog));
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.like(blog);
    dispatch(like(blog));
  }
}

export default blogSlice.reducer;