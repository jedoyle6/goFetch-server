'use strict';
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Signup Endpoints', function() {
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

  describe('METHOD and PATH', () => {
    beforeEach('insert test data', () =>
      helpers.seedAllTables(db, testTeams, testUsers, testGames)
    );

    it('Does the specified thing', () => {});

  });
});