const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const { initialBlogs, blogsInDb } = require('./test_helper'); 



beforeEach(async () => {
  await Blog.deleteMany({});
  const blogArray = initialBlogs.map(blog => new Blog(blog).save());
  await Promise.all(blogArray);
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(initialBlogs.length);
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');
  const titles = response.body.map(r => r.title);
  expect(titles).toContain('React patterns');
})

test('unique identifier property of blogs is named id', async () => {
  const response = await api.get('/api/blogs');
  const blog = response.body[0];
  expect(blog.id).toBeDefined();
})

test('blog can be added to the list', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: "Monkeys are awesome",
      author: "Monkey Expert",
      url: "www.monkeyfun.com",
      likes: 16
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = await blogsInDb();
  const updatedTitles = updatedBlogs.map(blog => blog.title);

  expect(updatedBlogs).toHaveLength(initialBlogs.length + 1);
  expect(updatedTitles).toContain('Monkeys are awesome');
});

test('likes for new blog defaults to 0', async () => {
  await api
  .post('/api/blogs')
  .send({
    title: "Monkeys are bad",
    author: "Monkey Hater",
    url: "www.monkeynofun.com",
  })

  const blogs = await blogsInDb();
  const newBlog = blogs.find(blog => blog.title === 'Monkeys are bad');
  expect(newBlog.likes).toBe(0);
})

test('new blog with no title or no url returns 400 Bad Request', async () => {
  await api
  .post('/api/blogs')
  .send({
    author: "John Bates",
  })
  .expect(400);
})

afterAll(() => {
  mongoose.connection.close();
})