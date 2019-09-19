'use strict';
/* global supertest */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe.only('Gamelog Endpoints', function() {
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

  describe('POST /gamelog', () => {
    beforeEach('insert test data', () =>
      helpers.seedAllTables(db, testTeams, testUsers, testGames)
    );

    it('Responds with status 401 when missing an auth header', () => {
      return supertest(app)
        .post('/gamelog')
        .send({points: 5})
        .expect(401);
    });

    it('Responds with status 400 when given invalid data', () => {
      return supertest(app)
        .post('/gamelog')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send({nonsense: 'hbgs0ve4ytuiv'})
        .expect(400);
    });

    it('Responds with status 201 and a new game entry when given valid data', () => {
      return supertest(app)
        .post('/gamelog')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send({points: 5})
        .expect(201);
    });

  });
});