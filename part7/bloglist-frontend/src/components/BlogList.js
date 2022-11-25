import Blog from './Blog';
import { useSelector, useDispatch } from 'react-redux';
import Togglable from './togglable';
import NewBlogForm from './newBlogForm';
import { useState } from 'react';
import { setNotification } from '../reducers/notificationReducer';
import { createBlog } from '../reducers/blogReducer';
import { Link } from 'react-router-dom';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';

const BlogList = () => {
  const blogs = useSelector(state => state.blogs);
  const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleNewBlog = async (event) => {
    event.preventDefault();
    const newBlog = { title, author, url };
    try {
      dispatch(createBlog(newBlog));      
      dispatch(setNotification(`Blog created: ${newBlog.title} ${newBlog.author}`, 3));
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (exception) {
      dispatch(setNotification(exception.message, 10));
    }
  };

  return (
    <>
      <Togglable buttonLabel="create new blog">
        <NewBlogForm
          handleNewBlog={handleNewBlog}
          title={title}
          setTitle={setTitle}
          author={author}
          setAuthor={setAuthor}
          url={url}
          setUrl={setUrl}
        />
      </Togglable>
      <h2>blogs</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {sortedBlogs.map(blog => (
              <TableRow key={blog.id}>
                <TableCell> <Link to={`/blogs/${blog.id}`}>{blog.title} </Link> </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BlogList;