'use strict';
const express = require('express');
const xss = require('xss');
const AuthService = require('./auth-service');

const loginRouter = express.Router();
const jsonBodyParser = express.json();

loginRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const { user_name, password } =  req.body;
    const loginUser = { user_name, password };
    for (const [key, value] of Object.entries(loginUser))
      if (value === null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    AuthService.getUserWithUserName(req.app.get('db'), loginUser.user_name)
      .then(user => {
        if (!user) {
          return res.status(400).json({ error: 'Incorrect user name or password'});
        }

        return AuthService.comparePasswords(password, user.password)
          .then(passwordsMatch => {
            if(!passwordsMatch) {
              return res.status(400).json({ error: 'Incorrect user name or password'});
            }
            const sub = user.user_name;
            const payload = { user_id: user.id};
            return res.send({authToken: AuthService.createJWT(sub, payload)});
          });

      })
      .catch(next);
  });



module.exports = loginRouter;