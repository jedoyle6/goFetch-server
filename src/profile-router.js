'use strict';
const express = require('express');
const xss = require('xss');
const AuthService = require('./auth-service');
const profileService = require('./profile-service');
const authenticateTokenJwt = require('./authenticateTokenJwt');

const profileRouter = express.Router();
const jsonBodyParser = express.json();

profileRouter
  .route('/')
  .get(authenticateTokenJwt, jsonBodyParser, (req, res, next) => {
    const user =  req.user;

    profileService.getProfileData(req.app.get('db'), user.user_name)
      .then(data => {
        return res.status(200).json(data);

      })
      .catch(next);

    
  });

// profileRouter
//   .route('/test')
//   .get(authenticateTokenJwt, jsonBodyParser, (req, res, next) => {
//     const user =  req.user;

//     profileService.getProfileDataTest(req.app.get('db'), user.user_name)
//       .then(data => {
//         return res.status(200).json(data);

//       })
//       .catch(next);

    
//   });


module.exports = profileRouter;