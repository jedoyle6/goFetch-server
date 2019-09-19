'use strict';
/* global supertest */
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Login Endpoints', function() {
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

  describe('POST /login', () => {
    beforeEach('insert test data', () =>
      helpers.seedAllTables(db, testTeams, testUsers, testGames)
    );

    const requiredFields = ['user_name', 'password'];

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        loginAttemptBody[field] = null;

        return supertest(app)
          .post('/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it('responds 400 "Unauthorized Request" when given a bad username and password', () => {
      const userInvalidUser = { user_name: 'user-not', password: 'existy' };
      return supertest(app)
        .post('/login')
        .send(userInvalidUser)
        .expect(400, { error: 'Incorrect user name or password' });
    });
 
    it('responds 200 and JWT auth token using secret when given valid credentials', () => {
      const userValidCreds = {
        user_name: testUser.user_name,
        password: testUser.password,
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_name,
          algorithm: 'HS256',
        }
      );
      return supertest(app)
        .post('/login')
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        });
    });

  });
});