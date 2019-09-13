'use strict';
const express = require('express');
const SignupService = require('./signup-service');
const xss = require('xss');

const signupRouter = express.Router();
const jsonBodyParser = express.json();

signupRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    return res.status(200).json('signup attempt successful!');

    
    
  });


module.exports = signupRouter;