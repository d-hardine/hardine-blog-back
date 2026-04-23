const express = require('express')
const blogRoute = require('./routes/blogRoute')

require('dotenv').config()

//express initialization
const app = express()

//access html body
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//home directory initialization
app.get('/', (req, res) => {
  res.status(200).send('OK')
})

//routes middleware
app.use('/api', blogRoute)

app.listen(3000, console.log(`Express server started at port 3000`))