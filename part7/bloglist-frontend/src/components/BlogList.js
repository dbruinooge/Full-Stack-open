import Blog from './Blog';
import { useSelector } from 'react-redux';

const BlogList = () => {
  const blogs = useSelector(state => state.blogs);
  const sortedBlogs = blogs.slice().sort((a, b) => b.likes - a.likes);

  return (
    <>
      <h2>blogs</h2>
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );
};

export default BlogList;