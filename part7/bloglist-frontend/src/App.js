import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import blogService from "./services/blogs";
import Notification from './components/Notification';
import BlogList from './components/BlogList';
import Users from './components/Users';
import User from './components/User';
import BlogView from './components/BlogView';
import { initializeBlogs } from './reducers/blogReducer';
import { login, logout, restoreUser } from './reducers/userReducer';
import { Container, TextField, Button } from '@mui/material';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom';

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          label="username"
          id="username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField
          label="password"
          id="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button variant="contained" color="primary" type="submit" id="login-button">
        login
      </Button>
    </form>
  );

  const padding = { padding: 5 };

  return (
    <Container>
      <Router>
        <div>
          <Link style={padding} to="/">home </Link>
          <Link stype={padding} to="/users">users </Link>
          {user.username === undefined ? (
            null
          ) : (
            <>
              <span>Logged in as {user.username} </span>
              <button onClick={handleLogout}>logout</button>
            </>
          )}
        </div>
        <div>
          <Notification />
          {user.username === undefined ? (
            loginForm()
          ) : (
            null
          )}
        </div>
        <Routes>
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<BlogList />} />        
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
