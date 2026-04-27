const db = require('../db/queries')

const getAllPosts = async (req, res) => {
  const allPosts = await db.retrieveAllPosts()
  res.status(200).json({message: "All posts retrieved", allPosts})
}

const getPost = async (req, res) => {
  const post = await db.retrievePost(req.params.postId)
  res.status(200).json({message: "post retrieved", post})
}

module.exports = { getAllPosts, getPost }