const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs')
const { prisma } = require('../lib/prisma.js') //CJS format
const fs = require('fs')
const path = require('path')

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem')
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8')

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
  ignoreExpiration: false,
}

//still not done, under construction
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  try {
    const foundUser = await prisma.user.findUnique({ where: { id: jwt_payload.sub } }) // this is using id

    if(foundUser) {
      return done(null, foundUser)
    } else {
      return done(null, false)
    }

  } catch(err) {
    return done(err, false) //if everything is going wrong, return error
  }
}))