const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = request.body;

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id);

    if (!blog.title || !blog.url) {
      return response.send(400);
    }
    
    blog.likes = blog.likes || 0;
    blog.user = user._id;

    new Blog(blog)
      .save()
      .then(result => {
        response.status(201).json(result);
        user.blogs = user.blogs.concat(result._id);
        user.save();
      })
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    console.log(blog.user.toString());
    console.log(request.user.toString());
    if (blog.user.toString() === request.user._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      return response.send(204);
    } else {
      return response.status(400).send({ error: 'user not authorized to delete that blog' });
    }
  } catch (error) {
    next(error);
  }
})

module.exports = blogsRouter;
