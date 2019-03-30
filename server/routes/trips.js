const express = require('express')
const app = require('express')()
const bodyParser = require('body-parser')
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors')
const mustacheExpress = require('mustache-express')


const path = require('path')
const session = require('express-session')
const uuid = require('uuid')
const router = express.Router()
const multer  = require('multer')
// const morgan = require('morgan')

// app.use(app.router);
// routes.initialize(app);






// ,{username: req.session.username}



module.exports = router
