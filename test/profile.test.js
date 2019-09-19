'use strict';
/*global supertest expect*/
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Profile Endpoints', function() {
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

  describe('GET /profile', () => {
    beforeEach('insert test data', () =>
      helpers.seedAllTables(db, testTeams, testUsers, testGames)
    );

    it('Returns status 401 Unauthorized if missing an authorization header', () => {
      return supertest(app)
        .get('/profile')
        .expect(401);
    });

    it('Returns status 200 and profile data object when given a valid authorization header', () => {
      return supertest(app)
        .get('/profile')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('user_name', 'team_id', 'rank', 'totalPlayers', 'total_points');
        });
    });

  });
});