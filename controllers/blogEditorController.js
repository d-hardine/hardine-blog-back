const db = require('../db/queries')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const passport = require('passport')

//issue JWT
const issueJWT = (user) => {

  const PRIV_KEY = Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('ascii')
  const expiresIn = '1d' //expires in 1 day
  const payload = {
    sub: user.id,
    name: user.name,
    username: user.username,
    iat: Math.floor(Date.now() / 1000)
  }

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {expiresIn: expiresIn, algorithm: 'RS256'})

  return {
    token: signedToken,
    expires: expiresIn
  }
}

const loginPost = async (req, res, next) => {
  try {
    const foundUser = await db.findUniqueUser(req.body.username)

    if (!foundUser) { //check if username is not avalable in the database,
      return res.status(401).json({ success: false, message: "couldn't find user" })
    }
    if(foundUser.role !== 'ADMIN') {
      return res.status(401).json({ success: false, message: "User is not an admin" })
    }
    const match = await bcrypt.compare(req.body.password, foundUser.password)
    if (!match) { //check if password/username couple is match
      // password does not match!
      return res.status(401).json({ success: false, message: "Incorrect password" })
    }

    const tokenObject = issueJWT(foundUser)

    return res.status(201).json({ success: true, user:foundUser, token: tokenObject.token, expiresIn: tokenObject.expires })
    } catch(err) {
      return next(err) //if everything is going wrong, return error
  }
}

const getAllPosts = async (req, res) => {
  const allPosts = await db.retrieveAllPosts()
  res.status(200).json({message: "All posts retrieved", allPosts})
}

const getAllTags = async (req, res) => {
  const allTags = await db.retrieveAllTags()
  res.status(200).json({message: "All posts retrieved", allTags})
}

module.exports = { loginPost, getAllPosts, getAllTags }