'use strict';
const xss = require('xss');
const knex = require('knex');

const LeaderboardService = {
  getTeamScores(db) {
    return db
      .raw(`
        SELECT team_name, SUM(points)
        FROM gofetch_users
        JOIN gofetch_gamelog ON gofetch_users.id = gofetch_gamelog.player_id
        join gofetch_teams on gofetch_users.team_id = gofetch_teams.id
        group by team_name
        order by SUM(points) DESC
      `)
      .then(res => {
        return res.rows;
      });      
  },
  
  getPlayerScores(db) {
    return db
      .raw(`
        SELECT user_name, SUM(points)
        FROM gofetch_users
        JOIN gofetch_gamelog ON gofetch_users.id = gofetch_gamelog.player_id
        join gofetch_teams on gofetch_users.team_id = gofetch_teams.id
        group by user_name
        order by SUM(points) DESC
      `)
      .then(res => {
        return res.rows;
      });      
  },


};

module.exports = LeaderboardService;