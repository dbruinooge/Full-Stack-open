import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeUsers } from '../reducers/usersReducer';
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom';

const Users = () => {
  console.log('rendering Users component');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUsers());
  }, []);

  const users = useSelector(state => state.users);

  return (
    <table>
      <thead>
        <tr>
          <th></th>
          <th><em>blogs created</em></th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => {
          return (
            <tr key={user.name}>
              <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};


export default Users;