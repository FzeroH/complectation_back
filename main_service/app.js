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

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/auth',authRoutes)
app.use('/api/admin',adminRoutes)

module.exports = app;
