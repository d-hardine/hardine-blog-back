const { Router } = require('express')
const blogController = require('../controllers/blogController')
const passport = require('passport')

const blogRouter = Router()

blogRouter.get('/all-posts', blogController.getAllPosts)
blogRouter.get('/specific-posts/:tagName', blogController.getSpecificPosts)
blogRouter.get('/post/:postId', blogController.getPost)
blogRouter.get('/all-tags', blogController.getAllTags)
blogRouter.get('/comments/:postId', blogController.getComments)
blogRouter.post('/new-comment', passport.authenticate('jwt', {session: false}), blogController.postNewComment)
blogRouter.post('/new-article', blogController.newArticle)

module.exports = blogRouter