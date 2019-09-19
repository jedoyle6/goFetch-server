'use strict';
/* global supertest expect */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Leaderboard Endpoints', function() {
  let db;

  const { testTeams, testUsers, testGames } = helpers.makeTestEntries();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /leaderboard/player', () => {
    beforeEach('insert test data', () =>
      helpers.seedAllTables(db, testTeams, testUsers, testGames)
    );

    it('Responds with status 200 and an array of score objects', () => {
      return supertest(app)
        .get('/leaderboard/player')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.be.an('object');
          expect(res.body[0]).to.have.keys('user_name', 'sum');
        });
    });

  });

  describe('GET /leaderboard/team', () => {
    beforeEach('insert test data', () =>
      helpers.seedAllTables(db, testTeams, testUsers, testGames)
    );

    it('Responds with status 200 and an array of score objects', () => {
      return supertest(app)
        .get('/leaderboard/team')
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('array');
          expect(res.body[0]).to.be.an('object');
          expect(res.body[0]).to.have.keys('team_name', 'sum');
        });
    });

  });
});