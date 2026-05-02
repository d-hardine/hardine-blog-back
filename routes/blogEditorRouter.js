const { Router } = require('express')
const blogEditorController = require('../controllers/blogEditorController')
const passport = require('passport')

const blogEditorRouter = Router()

blogEditorRouter.post('/login', blogEditorController.loginPost)
blogEditorRouter.get('/auth', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.send(`You're authenticated`)
})

blogEditorRouter.get('/all-posts', blogEditorController.getAllPosts)
blogEditorRouter.get('/all-tags', blogEditorController.getAllTags)

blogEditorRouter.post('/create-post', passport.authenticate('jwt', {session: false}), blogEditorController.uploadImage, blogEditorController.contentPost)
blogEditorRouter.put('/publish/:postId', blogEditorController.updatePublish)

module.exports = blogEditorRouter