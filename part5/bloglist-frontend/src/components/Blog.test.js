import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import NewBlogForm from './newBlogForm';

test('renders title', () => {
  const blog = {
    title: 'awesome blog',
    author: 'Mr. Writer',
    likes: 5,
    url: 'www.blog.com',
  };

  const handleDelete = jest.fn();

  render(<Blog blog={blog} handleDelete={handleDelete}/>);

  const title = screen.getByText('awesome blog');  
  expect(title).toBeDefined();

  const author = screen.queryByText('Mr. Writer');
  expect(author).toBeNull();

  const likes = screen.queryByText('likes');
  expect(likes).toBeNull();

  const url = screen.queryByText('www.blog.com');
  expect(url).toBeNull();
});

test('clicking view shows author, likes, and url', async () => {
  const blog = {
    title: 'awesome blog',
    author: 'Mr. Writer',
    likes: 5,
    url: 'www.blog.com',
  };

  const handleDelete = jest.fn();
  render(<Blog blog={blog} handleDelete={handleDelete}/>);

  const user = userEvent.setup();
  const button = screen.getByText('view');
  await user.click(button);

  const author = screen.queryByText('Mr. Writer');
  expect(author).toBeDefined();

  const likes = screen.queryByText('likes');
  expect(likes).toBeDefined();

  const url = screen.queryByText('www.blog.com');
  expect(url).toBeDefined();
});

test('clicking remove once calls the event handler once', async () => {
  const blog = {
    title: 'awesome blog',
    author: 'Mr. Writer',
    likes: 5,
    url: 'www.blog.com',
  };

  const handleDelete = jest.fn();
  render(<Blog blog={blog} handleDelete={handleDelete}/>);

  const user = userEvent.setup();
  const viewButton = screen.getByText('view');
  await user.click(viewButton);

  const likeButton = screen.getByText('remove');
  await user.click(likeButton);

  expect(handleDelete.mock.calls).toHaveLength(1);
});

test('create blog form', async () => {
  const handleNewBlog = jest.fn((event) => event.preventDefault());
  render(<NewBlogForm handleNewBlog={handleNewBlog}
                      title={1}
                      setTitle={() => 1}
                      author={1}
                      setAuthor={() => 1}
                      url={1}
                      setUrl={() => 1}
  />);

  const inputs = screen.getAllByRole('textbox');
  const sendButton = screen.getByText('create');
  const user = userEvent.setup();

  await user.type(inputs[0], 'new blog');
  await user.type(inputs[1], 'john doe');
  await user.type(inputs[2], 'www.blog.gov');
  await user.click(sendButton);

  expect(handleNewBlog.mock.calls).toHaveLength(1);
})