'use strict';
const xss = require('xss');
const knex = require('knex');

const ProfileService = {
  getProfileData(db, user_name) {
    return db.raw(`
        SELECT user_name, SUM(points) as total_points, team_id
        FROM gofetch_users
        JOIN gofetch_gamelog ON gofetch_users.id = gofetch_gamelog.player_id
        group by user_name, team_id
        order by SUM(points) desc
    `)
      .then(res => {
        const data = res.rows;
        const profileData = data.find(player => player.user_name === user_name);
        profileData.rank = data.findIndex(player => player.user_name === user_name) + 1;
        profileData.totalPlayers = data.length;
        return profileData;
      });    
  },
  


};

module.exports = ProfileService;