'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const xss = require('xss');

const AuthService = {

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('gofetch_users')
      .returning('*')
      .then(([user]) => user);
  },

  getUserWithUserName(db, user_name) {
    return db('gofetch_users')
      .where({user_name})
      .first();
  },

  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },

  createJWT(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      algorithm: 'HS256'
    });
  },
  
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {algorithm: 'HS256'});
  },

  validatePassword (password) {
    if (password.length <= 8) {
      return 'Password must be longer than 8 characters';
    }

    if (password.length >= 72) {
      return 'Password must be shorter than 72 characters';
    }

    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces';
    }

    const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

    if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character';
    }

    return null;
  },

  checkForUserName (db, user_name) {
    return db('gofetch_users')
      .where({user_name})
      .first()
      .then(user => !!user);
  },
    
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
      team_id: xss(user.team_id)
    };
  },
};

module.exports = AuthService;
