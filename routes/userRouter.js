const { Router } = require('express')
const userController = require('../controllers/userController')

const userRouter = Router()

userRouter.post('/signup', userController.validateSignUp, userController.signUpPost)
userRouter.post('/login', (req, res) => {
    res.send('kuntul')
})

module.exports = userRouter