const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const bcrypt = require('bcryptjs')
const { prisma } = require('../lib/prisma.js') //CJS format

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',
  issuer: 'accounts.examplesoft.com',
  audience: 'yoursite.net'
}

//still not done, under construction
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
  try {
    const foundUser = await prisma.user.findUnique({ where: { username: username } })

    if (!foundUser) { //check if username is not avalable in the database,
      return done(null, false, { message: "Incorrect username" }) //null means it's not an error, false means reject the auth (code 401)
    }
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match) { //check if password/username couple is match
      // passwords do not match!
      return done(null, false, { message: "Incorrect password" }) //null means it's not an error, false means reject the auth (code 401)
    }
    return done(null, foundUser) //return username, could be retrieved as req.user
  } catch(err) {
    return done(err) //if everything is going wrong, return error
  }
}));

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  User.findOne({id: jwt_payload.sub}, function(err, user) {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });
}));

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (userId, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        done(null, user)
    } catch(err) {
        console.error("deserializeUser error:", err)
        done(err)
    }
})