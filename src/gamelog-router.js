'use strict';
const express = require('express');
const GamelogService = require('./gamelog-service');
const authenticateTokenJwt = require('./authenticateTokenJwt');
const xss = require('xss');

const gamelogRouter = express.Router();
const jsonBodyParser = express.json();

gamelogRouter
  .route('/')
  .post(authenticateTokenJwt, jsonBodyParser, (req, res, next) => {

    const { points } = req.body;
    const newLog = { player_id: req.user.id, points: xss(points) };

    for (const [key, value] of Object.entries(newLog))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });
    
    GamelogService.postGameScore(
      req.app.get('db'),
      newLog
    )
      .then(response => {
        return res.status(201).json(response[0]);

      });
    
    
  });


module.exports = gamelogRouter;