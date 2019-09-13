'use strict';
const express = require('express');
const LoginService = require('./login-service');
const xss = require('xss');

const loginRouter = express.Router();
const jsonBodyParser = express.json();

loginRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    return res.status(200).json('login attempt successful!');

    
    
  });


module.exports = loginRouter;