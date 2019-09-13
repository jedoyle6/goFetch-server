'use strict';
const xss = require('xss');
const knex = require('knex');

const SignupService = {
  addNewUser(db, newUser) {
    return db
      .into('gofetch_users')
      .insert(newUser)
      .returning('*');      
  },

};

module.exports = SignupService;