'use strict';
const express = require('express');
const { TEAM_LB_DATA, PLAYER_LB_DATA } = require('./DUMMY_LB_DATA');
const LeaderboardService = require('./leaderboard-service');

const leaderboardRouter = express.Router();
const jsonBodyParser = express.json();

leaderboardRouter
  .route('/player')
  .get((req, res, next) => {
    return LeaderboardService.getPlayerScores(req.app.get('db'))
      .then(scores => {
        res.json(scores);
      })
      .catch(next);
  });

leaderboardRouter
  .route('/team')
  .get((req, res, next) => {
    return LeaderboardService.getTeamScores(req.app.get('db'))
      .then(scores => {
        res.json(scores);
      })
      .catch(next);
  });

module.exports = leaderboardRouter;