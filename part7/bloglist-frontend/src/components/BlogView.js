import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { likeBlog, removeBlog, addComment } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';

const BlogView = () => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState();
  const handleLike = async () => {
    try {
      dispatch(likeBlog(blog));
      dispatch(setNotification(`Liked blog: ${blog.title}`, 5));
    } catch (error) {
      dispatch(setNotification(error.message, 5));
    }
  };

  const id = useParams().id;
  const blogs = useSelector(state => state.blogs);
  const blog = blogs.find(blog => blog.id === id);

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={blog.url}>{blog.url}</a>
      <p>{blog.likes} likes <button onClick={() => handleLike(blog)}>like</button></p>
      <button onClick={() => dispatch(removeBlog(blog))}>remove</button>
      <h3>comments</h3>
      <form onSubmit={(event) => {
        event.preventDefault();
        dispatch(addComment(blog, comment));
        event.target.reset();
      } }>
        <input
          type="text"
          onChange={(e) => setComment(e.target.value)}>
        </input>
        <button type="submit">add comment</button>
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blog.comments.map(comment => (
              <TableRow key={comment}>
                <TableCell > { comment } </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BlogView;