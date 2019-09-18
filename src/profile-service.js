'use strict';
const xss = require('xss');
const knex = require('knex');

const ProfileService = {
  // getProfileDataOld(db, user_name) {
  //   return db.raw(`
  //       SELECT user_name, SUM(points) as total_points, team_id
  //       FROM gofetch_users
  //       JOIN gofetch_gamelog ON gofetch_users.id = gofetch_gamelog.player_id
  //       group by user_name, team_id
  //       order by SUM(points) desc
  //   `)
  //     .then(res => {
  //       const data = res.rows;
  //       const profileData = data.find(player => player.user_name === user_name);
  //       profileData.rank = data.findIndex(player => player.user_name === user_name) + 1;
  //       profileData.totalPlayers = data.length;
  //       return profileData;
  //     });    
  // },

  getProfileData(db, user_name) {
    let leaderboardData;
    let userData;
    return db.raw(`
      SELECT user_name, SUM(points) as total_points, team_id
      FROM gofetch_users
      JOIN gofetch_gamelog ON gofetch_users.id = gofetch_gamelog.player_id
      group by user_name, team_id
      order by SUM(points) desc
    `)
      .then(res => {
        leaderboardData = res.rows;
        // const profileData = leaderboardData.find(player => player.user_name === user_name);
        // profileData.rank = data.findIndex(player => player.user_name === user_name) + 1;
        // profileData.totalPlayers = data.length;
        // return profileData;
        return db.raw(`
          SELECT user_name, team_id
          FROM gofetch_users
          where user_name ilike '%${user_name}%'
        `);
      })
      .then(res2 => {
        userData = res2.rows;
        const profileData = userData[0];
        profileData.rank = leaderboardData.findIndex(player => player.user_name === user_name) + 1;
        profileData.totalPlayers = leaderboardData.length;
        let rankData = leaderboardData.find(player => player.user_name === user_name);
        if (!rankData) {
          profileData.total_points = 0;
        } else {
          profileData.total_points = parseInt(rankData.total_points);
        }
       
        return profileData;
      });    
  },
  


};

module.exports = ProfileService;