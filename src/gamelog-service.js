'use strict';
const xss = require('xss');
const knex = require('knex');

const GamelogService = {
  postGameScore(db, gamescore) {
    return db
      .into('gofetch_gamelog')
      .insert(gamescore)
      .returning('*');      
  },
  


};

module.exports = GamelogService;