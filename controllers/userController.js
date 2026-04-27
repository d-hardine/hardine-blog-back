const db = require('../db/queries')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')

//signup middlewares
const validateSignUp = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username field must not be empty.')
    .isLength({min: 3, max: 15}).withMessage(`Username must be between 3 and 15 characters.`)
    .custom(async (inputtedUsername) => {
      const duplicateUsername = await db.duplicateUsernameSearch(inputtedUsername)
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
      console.log(hashedPassword)
      await db.createNewUser(req.body.username, req.body.displayName, hashedPassword)
      res.status(201).json({message: "inputted data for sign up OK"})
      next()
    }
  } catch(err) {
    res.send(err)
    return next(err)
  }
}

module.exports = { validateSignUp, signUpPost }