import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login';
import Togglable from './components/togglable';
import NewBlogForm from './components/newBlogForm';
import axios from 'axios';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      );

      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.removeItem('loggedUser');
    blogService.setToken(null);
    setUser(null);
  }

  const handleNewBlog = async (event) => {
    event.preventDefault();
    const newBlog = { title, author, url };
    try {
      const result = await blogService.create(newBlog);
      setErrorMessage(`Blog created: ${result.title} ${result.author}`);
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
      setTitle('');
      setAuthor('');
      setUrl('');
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      );
    } catch (exception) {
      setErrorMessage(exception.message);
      setTimeout(() => {
        setErrorMessage('');
      }, 5000);
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog);
        blogService.getAll().then(blogs =>
          setBlogs( blogs )
        );
      } catch (exception) {
        setErrorMessage(exception.message);
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      }
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
        id='username'
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
        id='password'
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id='login-button'>login</button>
    </form>
  )

  const blogList = () => {
    blogs.sort((a, b) => b.likes - a.likes);
    return (
      <>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} handleDelete={handleDelete} />
      )}
      </>
    )
  }

  return (
    <div>
      <p>{errorMessage}</p>
      {user === null ?
        loginForm() :
        <div>
          <p>Logged in as {user.username}</p>
          <button onClick={handleLogout}>logout</button>
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
          {blogList()}          
        </div>
      }
    </div>
  )
}

export default App
