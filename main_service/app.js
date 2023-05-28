const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();

// Routes
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const requestRoutes = require('./routes/request')
const companyRoutes = require('./routes/company')
const publicationRoutes = require('./routes/publication')
const studentsDisciplineRoutes = require('./routes/students_discipline')
const usertRoutes = require('./routes/user')
const documentRoutes = require('./routes/document')
const path = require('path');

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: '*'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

app.use('/api/auth',authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/', requestRoutes);
app.use('/api/', companyRoutes);
app.use('/api/', publicationRoutes);
app.use('/api/', studentsDisciplineRoutes);
app.use('/api/user', usertRoutes);
app.use('/api/document/', documentRoutes)

module.exports = app;
