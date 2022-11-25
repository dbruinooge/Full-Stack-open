import { useState } from "react";
import { likeBlog, removeBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom';

const Blog = ({ blog }) => {
  const dispatch = useDispatch();
  const [detailsVisible, setDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        dispatch(removeBlog(blog));
        dispatch(setNotification(`Deleted blog: ${blog.title}`, 5));
      } catch (exception) {
        dispatch(setNotification(error.message, 5));
      }
    }
  };

  const handleLike = async () => {
    try {
      dispatch(likeBlog(blog));
      dispatch(setNotification(`Liked blog: ${blog.title}`, 5));
    } catch (error) {
      dispatch(setNotification(error.message, 5));
    }
  };

  return (
    <div style={blogStyle}>
      <Link to={`/blogs/${blog.id}`}>{blog.title} </Link>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default Blog;
