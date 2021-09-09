const express = require('express') //web server 
const containerRouter = require('./routers/dockerContainer') // router for http requests
const imageRouter = require('./routers/dockerImage') 
require('./db/sqlite3')

const app = express()

app.use(express.json()) //for parsing json 
app.use(containerRouter)
app.use(imageRouter)

//seperate the code from app.listen so that way we can import app.js for testing
//without having to start up the actual server
module.exports = app 