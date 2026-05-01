const express = require('express')
const cors = require('cors')
const pool = require('./db/pool')
const passport = require('passport')
const blogRouter = require('./routes/blogRouter')
const userRouter = require('./routes/userRouter')
const blogEditorRouter = require('./routes/blogEditorRouter')

require('dotenv').config()

//express initialization
const app = express()

//cors setting
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your React app's URL
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

//enable passport middleware to use session
app.use(passport.initialize())

//home directory initialization
app.get('/', (req, res) => {
  res.status(200).send('OK')
})

//routes middleware
app.use('/api', blogRouter)
app.use('/api', userRouter)
app.use('/editor', blogEditorRouter)

// Need to require the entire Passport library module so index.js knows about it
require('./lib/passport')

app.listen(3000, console.log(`Express server started at port 3000`))