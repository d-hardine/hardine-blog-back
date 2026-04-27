const { Router } = require('express')
const blogController = require('../controllers/blogController')

const blogRouter = Router()

blogRouter.get('/all-posts', blogController.getAllPosts)
blogRouter.get('/post/:postId', blogController.getPost)

module.exports = blogRouter