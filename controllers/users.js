const router = require('express').Router()
const { Op } = require('sequelize')
const { User, Blog, Skim } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog
      }
    ]
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})


// instead of GET /api/users/:id?read=true Its GET /api/users/:id?status=read
router.get('/:id', async (req, res) => {
  try {
    const status = req.query.status;
    let condition = {};
    if (status) {
      condition.status = status;
    }

    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Skim,
        where: condition,
        attributes: ['status', 'id'],
        include: [{
          model: Blog,
          attributes: ['author', 'title', 'year', 'id']
        }]
      }]
    });

    if (user) {
      console.log(user);
      const response = {
        name: user.name,
        username: user.username,
        disabled: user.disabled,
        skims: user.skims 
      };
      res.json(response);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router