const router = require('express').Router();
const { Blog, User } = require('../models');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');
const { Op } = require('sequelize');

app.use(express.json());

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      try {
        console.log(authorization.substring(7))
        req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
      } catch (error){
        console.log(error)
        return res.status(401).json({ error: 'token invalid' })
      }
    } else {
      return res.status(401).json({ error: 'token missing' })
    }
    next()
  }

  router.get('/', async (req, res, next) => {
    try {
      const blogs = await Blog.findAll({
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.substring]: req.query.search ? req.query.search : ''
                    }
                },
                {
                    author: {
                        [Op.substring]: req.query.search ? req.query.search : ''
                    }
                }
            ]
        },
        order: [
            ['likes', 'DESC']
        ]
      })
      res.json(blogs)
    } catch (error) {
      next(error)
    }
})

router.post('/', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date()})
        res.json(blog)
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error: error.message })
        }
})

router.put('/:id', async (req, res, next) => {
    try {
      const blog = await Blog.findByPk(req.params.id)
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' })
      }
      blog.likes = req.body.likes
      await blog.save()
      res.json(blog)
    } catch (error) {
      next(error)
    }
})

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.delete('/:id', tokenExtractor, blogFinder, async (req, res, next) => {
    try {
        if (!req.blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const user = await User.findByPk(req.decodedToken.id);
        if (req.blog.userId !== user.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (req.blog.userId === user.id) {
        await req.blog.destroy();
        res.status(204).end();
        }
    } catch (error) {
        next(error);
    }
});


const errorHandler = (error, req, res, next) => {
    console.error('Error:', error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'An unexpected error occurred' })
}

router.use(errorHandler)

module.exports = router;