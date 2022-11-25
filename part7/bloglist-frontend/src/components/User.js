import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const User = () => {
  const id = useParams().id;
  const users = useSelector(state => state.users);
  const user = users.find(user => user.id === id);
  if (!user) {
    return null;
  }
  
  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map(blog => {
          return (
            <li key={blog.title}>{blog.title}</li>
          );
        })}
      </ul>
    </>
  )
}

export default User;