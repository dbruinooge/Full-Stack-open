import { useState } from "react";
import blogService from "../services/blogs";
import { likeBlog, removeBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';
import PropTypes from "prop-types";
import { useDispatch } from 'react-redux';

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
      {blog.title + " "}
      <button onClick={() => setDetailsVisible(!detailsVisible)}>
        {detailsVisible ? "hide" : "view "}
      </button>
      {detailsVisible && (
        <>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
          </p>
          <p>{blog.author}</p>
          <button onClick={() => handleDelete(blog)}>remove</button>
        </>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default Blog;
