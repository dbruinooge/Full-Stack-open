import { useState } from 'react';
import blogService from '../services/blogs';
import PropTypes from 'prop-types';

const Blog = ({blog, handleDelete}) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    const updatedBlog = await blogService.like(blog);
    setLikes(updatedBlog.likes);
  }

  return (
    <div style={blogStyle}>
      {blog.title + ' '} 
      <button onClick={() => setDetailsVisible(!detailsVisible)}>
        {detailsVisible ? 'hide' : 'view '}
      </button>
      {detailsVisible &&
        <>
          <p>{blog.url}</p>
          <p>likes {likes} <button onClick={handleLike}>like</button></p>
          <p>{blog.author}</p>
          <button onClick={() => handleDelete(blog)}>remove</button>
        </>      
      }
    </div> 
  ) 
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default Blog