const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user');
  response.json(blogs);
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const blog = request.body;
  const user = request.user;

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

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

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (blog.user.toString() === request.user._id.toString()) {
      const user = request.user;
      const index = user.blogs.indexOf(request.params.id);
      user.blogs.splice(index, 1);
      await User.findByIdAndUpdate(user._id, { blogs: user.blogs });
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
