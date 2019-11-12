'use strict';
const express = require('express');
const xss = require('xss');
const AuthService = require('./auth-service');

const signupRouter = express.Router();
const jsonBodyParser = express.json();

signupRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    
    for (const field of ['user_name', 'password', 'team_id']) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing ${field} in request body`});
      }
    }

    const { user_name, password, team_id } = req.body;

    const passwordError = AuthService.validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError});
    }

    AuthService.checkForUserName(req.app.get('db'), user_name)
      .then(userNameTaken => {
        if (userNameTaken) {
          return res.status(400).json({ error: 'User name is already taken'});
        }
        return AuthService.hashPassword(password)
          .then(hash => {
            const newUser = {
              user_name: xss(user_name),
              password: hash,
              team_id: xss(team_id)
            };
            return AuthService.insertUser(req.app.get('db'), newUser)
              .then(user => {
                const sub = user.user_name;
                const payload = { user_id: user.id};
                res.status(201).send({authToken: AuthService.createJWT(sub, payload)});
              });
          });       
        
      });    
  
  });


module.exports = signupRouter;