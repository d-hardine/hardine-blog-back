const { Router } = require('express')
const userController = require('../controllers/userController')
const passport = require('passport')

const userRouter = Router()

userRouter.post('/signup', userController.validateSignUp, userController.signUpPost)
userRouter.post('/login', userController.loginPost)
userRouter.get('/auth', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send(`You're authenticated`)
})

module.exports = userRouter