const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const Blog = require('../models/blog');
const User = require('../models/user');
const { initialBlogs, blogsInDb, usersInDb } = require('./test_helper'); 
let token;

async function createUser() {
  const user = {
    username: 'jth',
    password: 'letmein'
  }
  await api.post('/api/users').send(user);
  const response = await api.post('/api/login').send(user);
  token = response.body.token;
}

beforeAll(async () => {
  await createUser();
})

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogArray = initialBlogs.map(blog => new Blog(blog).save());
  await Promise.all(blogArray);
})

test('blog can be added to the list', async () => {
  await api
    .post('/api/blogs')
    .set({ Authorization: 'Bearer ' + token })
    .send({
      title: "Monkeys are awesome",
      author: "Monkey Expert",
      url: "www.monkeyfun.com",
      likes: 16,
    })
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const updatedBlogs = await blogsInDb();
  const updatedTitles = updatedBlogs.map(blog => blog.title);

  expect(updatedBlogs).toHaveLength(initialBlogs.length + 1);
  expect(updatedTitles).toContain('Monkeys are awesome');
});

test('adding blog fails if token not provided', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'great blog',
      author: 'some guy',
      url: 'somewhere out there',
      likes: 5
    })
    .expect(400);
})

describe('when creating a new user', () => {
  test('creating fails if username has less than 3 characters', async () => {
    const user = {
      username: 'db',
      name: 'derek the great',
      password: 'supersecret'
    }

    const response = await api.post('/api/users').send(user);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('shorter than the minimum');
  })

  test('creating fails if password has less than 3 characters', async () => {
    const user = {
      username: 'longenoughname',
      name: 'my name',
      password: '12'
    }

    const response = await api.post('/api/users').send(user);
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toContain('at least 3');
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'dbsdfd',
      name: 'Derek B',
      password: 'secret',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    expect(usernames).toContain(newUser.username);
  })
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

test('likes for new blog defaults to 0', async () => {
  await createUser();
  await api
  .post('/api/blogs')
  .set('Authorization', 'Bearer ' + token)
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

afterAll(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  mongoose.connection.close();
})