const db = require('../db/queries')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const passport = require('passport')
const cloudinary = require('cloudinary').v2

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

//multer setup
const path = require('node:path')
const multer  = require('multer')
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        let fn = file.originalname + ' - ' + Date.now() + path.extname(file.originalname)
        cb(null, fn)
    }
})
const fileFilter = (req, file, cb) => { //filter that only image file that can be uploaded
  // Check file types (mimetype) and extensions
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true); // Accept file
  }
  
  // Reject file and pass an error message
  cb(new Error('Only image files (JPEG, JPG, PNG) are allowed!'), false); 
};
const upload = multer({
  storage: storage,
  limits: {fileSize: 1048576}, // 1 MB
  fileFilter: fileFilter
})

//use this multer upload middleware to upload stuff
const uploadImage = upload.single('image')

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

const contentPost = async (req, res, next) => {
  const { title, subtitle, tags, content } = req.body
  const tagArray = tags.split(',')

  const uploadToCloud = await cloudinary.uploader.upload(req.file.path) //upload to cloud
  await db.postNewArticle(req.user.id, title, subtitle, content, uploadToCloud.secure_url, tagArray)

  res.status(200).json({message: "new post created"})
}

const updatePublish = async (req, res) => {
  const updatedPublishStatus = await db.updatePublish(req.params.postId)
  res.status(200).json({message: 'publish status successfully updated', updatedPublishStatus})
}

module.exports = { uploadImage, loginPost, getAllPosts, getAllTags, contentPost, updatePublish }