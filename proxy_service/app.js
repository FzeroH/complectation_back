const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const fs = require('fs');


const session = require('express-session')
const redisStorage = require('connect-redis')(session);
const redis = require('redis');
const client = redis.createClient();

const host = '45.130.151.194';
const port = 6379;
client.on(`error`,err=>{
    console.log(err)
});

const app = express();
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    store: new redisStorage({
            host: host,
            port: 6379,
            client: client,}),
    saveUninitialized: true,
    secret: 'keyboard cat',
    key: 'sid',
    cookie: {
        path:'/',
        httpOnly: true,
        maxAge: null
    },
    encode: false
}))
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const requestRoutes = require('./routes/request')
const companyRoutes = require('./routes/company')
const publicationRoutes = require('./routes/publication')
const studentsDisciplineRoutes = require('./routes/students_discipline')
const usertRoutes = require('./routes/user')
const documentRoutes = require('./routes/document')

app.use('/api/auth',authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/', requestRoutes);
app.use('/api/', companyRoutes);
app.use('/api/', publicationRoutes);
app.use('/api/', studentsDisciplineRoutes);
app.use('/api/', usertRoutes);
app.use('/api/document/', documentRoutes)

app.get('/test',async (req,res)=>{
    console.log(req.sessionID);
    res.sendStatus(200);
})

module.exports = app;
