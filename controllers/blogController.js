const db = require('../db/queries')

const getAllPosts = async (req, res) => {
  const allPosts = await db.retrieveAllPosts()
  res.status(200).json({message: "All posts retrieved", allPosts})
}

const getPublishedPosts = async (req, res) => {
  const publishedPosts = await db.retrievePublishedPosts()
  res.status(200).json({message: "All published retrieved", publishedPosts})
}

const getSpecificPosts = async (req, res) => {
  const specificPosts = await db.retrieveSpecificPosts(req.params.tagName)
  res.status(200).json({message: "specific posts retrieved", specificPosts})
}

const getPost = async (req, res) => {
  const post = await db.retrievePost(req.params.postId)
  res.status(200).json({message: "post retrieved", post})
}

const getAllTags = async (req, res) => {
  const allTags = await db.retrieveAllTags()
  res.status(200).json({message: "All posts retrieved", allTags})
}

const getComments = async (req, res) => {
  const comments = await db.retrieveComments(req.params.postId)
  res.status(200).json({message: "comments retrieved", comments})
}

const postNewComment = async (req, res) => {
  const { newComment, postId } = req.body
  await db.postNewComment(newComment, postId, req.user.id)
  res.send('comment added')
}

const newArticle = async (req, res) => {
  const { authorId, title, subtitle, content, tags } = req.body
  await db.postNewArticle(authorId, title, subtitle, content, tags)
  res.send('new article created')
}

module.exports = { getAllPosts, getPublishedPosts, getSpecificPosts, getPost, getAllTags, getComments, postNewComment, newArticle }