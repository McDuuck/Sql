const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { Skim, User } = require('../models')

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

router.post('/', async (req, res) => {
    try {
      const { blog_id, status, user_id } = req.body;
      const skim = await Skim.create({ blog_id, status, user_id });
      res.json(skim);
    } catch(error) {
      return res.status(400).json({ error });
    }
  });

router.get('/', async (req, res) => {
    try {
      const skims = await Skim.findAll({
        include: {
          model: User,
          attributes: ['name', 'username', 'id']
        }
      });
      res.json(skims);
    } catch(error) {
      return res.status(400).json({ error });
    }
  });

  router.put('/:id', tokenExtractor, async (req, res) => {
    try {
      const { status } = req.body;
      const skim = await Skim.findByPk(req.params.id);
      if (skim) {
        if (skim.user_id !== req.decodedToken.id) {
          return res.status(403).json({ error: 'user not authorized to update this skim' });
        }
        skim.status = status;
        await skim.save();
        res.json(skim);
      } else {
        res.status(404).end();
      }
    } catch(error) {
      return res.status(400).json({ error });
    }
  });

module.exports = router