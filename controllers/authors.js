const router = require('express').Router()
const { Blog, User } = require('../models')
const express = require('express')
const app = express()
const sequelize = require('sequelize')

app.use(express.json())

router.get('/', async (req, res, next) => {
    try {
        const blogs = await Blog.findAll({
            group: ['author'],
            attributes: [
                'author', 
                [sequelize.fn('count', sequelize.col('author')), 'blogs'], 
                [sequelize.fn('sum', sequelize.col('likes')), 'likes']
            ],
        })

        res.json(blogs)
    }
    catch (error) {
        next(error)
    }
})

module.exports = router