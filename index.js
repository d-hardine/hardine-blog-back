const express = require('express')
const cors = require('cors')
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const pool = require('./db/pool')
const passport = require('passport')
const blogRoute = require('./routes/blogRoute')

require('dotenv').config()

//express initialization
const app = express()

//cors setting
const corsOptions = {
  origin: 'http://localhost:5173/', // Replace with your React app's URL
  credentials: true, // This allows the browser to send/receive cookies
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

//cors enabled accordance to setting
app.use(cors(corsOptions))

//access html body
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//initializing cloudinary
require('./lib/cloudinary')

//create session table inside postgres
const sessionStore = new pgSession({
  pool: pool,
  createTableIfMissing: true //if you're using prisma, please make the session table at your schema yourself
})

//setting up session and store it to postgres db
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  proxy: true,
  cookie: {
    maxAge: 1000 /*1 sec*/ * 60 /*1 minute*/ * 60 /*1 hour*/ * 24 /*1 day*/ * 7, //equals 1 week
    httpOnly: true, //for security, prevents JS access
    secure: process.env.DEV_MODE ? false : true,
    sameSite: 'lax',
  }
}))

//enable passport middleware to use session
app.use(passport.initialize())
app.use(passport.session())

//home directory initialization
app.get('/', (req, res) => {
  res.status(200).send('OK')
})

//routes middleware
app.use('/api', blogRoute)

// Need to require the entire Passport library module so index.js knows about it
require('./lib/passport')

app.listen(3000, console.log(`Express server started at port 3000`))