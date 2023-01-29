const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');
const passport = require("passport");
const http = require('http').Server(app);
const io = require('socket.io')(http);

//passport config:
require('./config/passport')(passport)
//mongoose
const uri = 'mongodb+srv://Dozz:donce2002@webapp.q4nzmia.mongodb.net/?retryWrites=true&w=majority'
async function connect() {
    try {
        await mongoose.connect(uri)
        console.log('connected to mongodb')
    } catch (error) {
        console.error(error);
    }
}
connect();

app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error  = req.flash('error');
    next();
    })
    
//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
      io.emit('chat message', ` ${msg}`);
      console.log(`web: ${msg}`)
    });
  });

app.listen(3000)
console.log("http://localhost:3000")