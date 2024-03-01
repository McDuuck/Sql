const router = require('express').Router()
const { Session } = require('../models')

router.get('/', async (req, res) => {
    try {
        const sessions = await Session.findAll()
        res.json(sessions)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router