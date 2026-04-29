const db = require('../db/queries')
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const passport = require('passport')
const { body, validationResult } = require('express-validator')

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

//signup middlewares
const validateSignUp = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username field must not be empty.')
    .isLength({min: 3, max: 15}).withMessage(`Username must be between 3 and 15 characters.`)
    .custom(async (inputtedUsername) => {
      const duplicateUsername = await db.findUniqueUser(inputtedUsername)
        if(duplicateUsername) {
          throw new Error('Username has been used, pick another one.')
        }
    }),
  body('displayName')
    .notEmpty().withMessage('Display Name field must not be empty.')
    .isLength({min: 3, max: 15}).withMessage(`Display Name must be between 3 and 15 characters.`),
  body('password').isStrongPassword({ //it needs at least 5 conditions written to make it work, which is stupid
      minLength: 8,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0
    }).withMessage(`Password must be at least 8 characters, with numbers and letters.`),
  body('confirmPassword').custom((confirmedPasswordvalue, {req}) => {
    return confirmedPasswordvalue === req.body.password
    }).withMessage("Password and confirm password doesn't match.")
]
const signUpPost = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      res.status(400).json({errors: errors.array()})
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      await db.createNewUser(req.body.username, req.body.displayName, hashedPassword)
      res.status(201).json({message: "inputted data for sign up OK"})
      next()
    }
  } catch(err) {
    res.send(err)
    return next(err)
  }
}

const loginPost = async (req, res, next) => {
  try {
    const foundUser = await db.findUniqueUser(req.body.username)

    if (!foundUser) { //check if username is not avalable in the database,
      return res.status(401).json({ success: false, message: "couldn't find user" })
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

module.exports = { validateSignUp, signUpPost, loginPost }