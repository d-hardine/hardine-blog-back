const { Router } = require('express')
const userController = require('../controllers/userController')

const blogRoute = Router()

blogRoute.get('/test', (req, res) => {
    res.send('okay')
})

module.exports = blogRoute