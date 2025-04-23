const express = require("express")
const cors = require("cors");
const app = express();
const ejs = require('ejs');
var path = require('path');
var cookieParser = require('cookie-parser')
var logger = require('morgan');

const session = require('express-session')
const http=require('http');
require("dotenv").config();
const port = process.env.PORT || 3000;
// require("./db/connection");
const flash = require("express-flash");
app.use(session({
    secret: 'mysecret', // Replace with your own secret key
    resave: false,
    saveUninitialized: false
  }));
  
const mongoose = require('mongoose');
const db = 'mongodb+srv://laxsavani:laxsavani@cluster0.ykxfhke.mongodb.net/Morsy'
mongoose.connect(db, { 
            // useCreateIndex: true, 
            // useFindAndModify: false, 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
      })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Set Mongoose strictQuery option
mongoose.set('strictQuery', false);

app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'party')));
app.use(logger('dev'));

const adminRouter = require("./routers/admin.routes");
const managerRouter = require("./routers/manager.routes");
const studentRouter = require("./routers/student.routes");

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'index.html'))
})
app.post('/s',(req,res)=>{
    console.log(req.body);
})
app.use("/admin", adminRouter);
app.use('/manager',managerRouter);
app.use('/student',studentRouter);

app.use((req,res,next)=>{
    res.render('404')
})
// const ioHook = require('iohook');
const fs = require('fs');

// Create a writable stream to a log file
const logStream = fs.createWriteStream('log.txt', { flags: 'a' });

// Set up event listeners for keyboard and mouse events
// ioHook.on('keydown', event => {
//   logStream.write(`Key Pressed: ${event.keychar}\n`);
// });

// ioHook.on('mousedown', event => {
//   logStream.write(`Mouse Clicked: Button ${event.button}, X: ${event.x}, Y: ${event.y}\n`);
// });

// Enable the event listeners
// ioHook.on('mousemove', event => {
//   logStream.write(`Mouse Moved: X: ${event.x}, Y: ${event.y}\n`);
// });

// ioHook.start();

app.listen(port, () => {
    console.log(`listing to the port ${port}`)
});
