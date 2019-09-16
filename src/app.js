'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const leaderboardRouter = require('./leaderboard-router');
const gamelogRouter = require('./gamelog-router');
const loginRouter = require('./login-router');
const signupRouter = require('./signup-router');
const profileRouter = require('./profile-router');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common' ;

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/leaderboard', leaderboardRouter);
app.use('/gamelog', gamelogRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/profile', profileRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if(NODE_ENV === 'production') {
    response = {error: {message: 'server error'}};
  } else {
    console.error(error);
    response = {message : error.message, error};
  }
  res.status(500).json(response);
});

module.exports = app;