
const express = require('express')
const app = require('express')()
const bodyParser = require('body-parser')
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors')
const mustacheExpress = require('mustache-express')
const multer  = require('multer')
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const uuid = require('uuid')
const tripRoutes = require('./routes/trips')
const userRoutes = require('./routes/users')
let imageName = ''
const Trip = require('./trip')
const User = require('./user')
// app.use('/trips',tripRoutes)
// app.use('/users',userRoutes)
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'));
// app.use(cors())
app.use(express.static('uploads'))
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')
// app.use(express.static("client"))
// app.use(app.app)
// routes.initialize(app)
app.use(express.static('client'))
app.use(session({
  secret: 'eagle',
  resave: false,
  saveUninitialized: false
}))
let messages = []
let users = []
let trips = []
let currentUser = {}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    fileSource = './uploads'
    cb(null, fileSource)
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    imageName = file.fieldname + '-' + Date.now()+ '.' +extension
    cb(null, imageName)
  }
})
var upload = multer({ storage: storage })

app.get('/',(req,res) => {
 res.render('index')
})

app.get('/trips',(req,res) => {
  res.render('trips',{tripList : currentUser.trips})
})

// app.post('/trips',(req,res) => {
//   let tripId = uuid()
//   console.log(tripId);
//   let title = req.body.title
//   let leave = req.body.leave
//   let comeBack = req.body.comeBack
//   let imageURL = req.body.imageURL
//   let newTrip = new Trip(tripId,title,leave,comeBack,imageURL)
//   currentUser.trips.push(newTrip)
//   console.log(currentUser)
//   res.render('trips',{tripList : currentUser.trips })
// })

app.get('/add-trip',(req,res) => {
  res.render('add-trip')
})

app.post('/add-trip', upload.single('image'), (req, res, next) => {
  let tripId = uuid()
  console.log(tripId);
  let title = req.body.title
  let image = `/${imageName}`
  let dateDepart = req.body.dateDepart
  let dateReturn = req.body.dateReturn
  console.log(title);
  let newTrip = new Trip(tripId,title,dateDepart,dateReturn,image)
  currentUser.trips.push(newTrip)
  console.log(currentUser)
  res.render('trips',{tripList : currentUser.trips })
  res.redirect('/trips')
})

app.post('/deleteTrip',function(req,res){
  let tripId = req.body.tripId

  currentUser.trips = currentUser.trips.filter(function(trip){
    return trip.tripId != tripId
  })
   console.log(currentUser)
  res.render('trips',{tripList : trips})
})

app.get('/register', (req,res) => {
  res.render('register')
})

app.post('/register',function(req,res){
  let username = req.body.username
  let password = req.body.password

  let newUser = new User(username,password)
  users.push(newUser)

  console.log(users)
  res.redirect('/login')
})

app.get('/login', (req,res) => {
  res.render('login')
})

app.post('/login',function(req,res){
  let username = req.body.username
  let password = req.body.password

  currentUser = users.find(function(user){
    if (user.username == username && user.password == password) {
      return user.username
    }else {
      res.redirect('/login-error')
    }
  })
  console.log(currentUser)
  res.redirect('trips')
})

app.get('/login-error',function(req,res){
  res.render('login-error')
})

app.post('/logout',function(req,res){
  req.session.destroy()
  currentUser = {}
  res.redirect('/login')
  console.log(currentUser)
})

app.listen(3000, () => {
  console.log(`app running`)
})
