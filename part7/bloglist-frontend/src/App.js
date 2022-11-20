import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/togglable";
import NewBlogForm from "./components/newBlogForm";
import Notification from './components/Notification';
import BlogList from './components/BlogList';
import { setNotification } from './reducers/notificationReducer';
import { initializeBlogs, createBlog } from './reducers/blogReducer';
import { login, logout, restoreUser, setToken } from './reducers/userReducer';

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  console.log(useSelector(state => state));

  const user = useSelector(state => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      blogService.setToken(loggedUser.token);
      dispatch(restoreUser(loggedUser));
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      dispatch(login({ username, password }));
      blogService.setToken(user.token);   
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.log(exception);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    dispatch(logout());
  };

  const handleNewBlog = async (event) => {
    event.preventDefault();
    const newBlog = { title, author, url };
    try {
      dispatch(createBlog(newBlog));      
      dispatch(setNotification(`Blog created: ${newBlog.title} ${newBlog.author}`, 3));
      setTitle("");
      setAuthor("");
      setUrl("");
      dispatch(initializeBlogs());
    } catch (exception) {
      dispatch(setNotification(exception.message, 10));
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id="login-button">
        login
      </button>
    </form>
  );

  return (
    <div>
      <Notification />
      {user.username === undefined ? (
        loginForm()
      ) : (
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
          <BlogList/>
        </div>
      )}
    </div>
  );
};

export default App;
