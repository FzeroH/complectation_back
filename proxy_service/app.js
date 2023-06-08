const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const fs = require('fs');

const sqlite = require('better-sqlite3')
const session = require('express-session')
const SqliteStore = require('better-sqlite3-session-store')(session)
const db = new sqlite('session.db', {verbose: console.log})

const app = express();
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    store: new SqliteStore({
        client: db,
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 86400000 // Время жизни куки (24 часа)
    }
}));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
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
