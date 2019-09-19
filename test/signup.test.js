'use strict';
/*global supertest expect*/
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('Signup Endpoints', function() {
  let db;

  const { testTeams, testUsers, testGames } = helpers.makeTestEntries();
  const testUser = {
    id: 4,
    team_id: testTeams[0].id,
    user_name: 'test-user-brand-new',
    password: 'Password123!',
  };

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

  describe('POST /signup', () => {
    beforeEach('insert test data', () =>
      helpers.seedAllTables(db, testTeams, testUsers, testGames)
    );

    const requiredFields = ['user_name', 'password', 'team_id'];

    requiredFields.forEach(field => {
      const signupAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
        team_id: testUser.team_id
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        signupAttemptBody[field] = null;

        return supertest(app)
          .post('/signup')
          .send(signupAttemptBody)
          .expect(400, {
            error: `Missing ${field} in request body`,
          });
      });
    });

    it('responds with 400 "Password must be longer than 8 characters" if password is too short', () => {
      const registerAttemptShortPassword = {
        id: 4,
        team_id: testTeams[0].id,
        user_name: 'test-user-brand-new',
        password: 'Pass1!',
      };

      return supertest(app)
        .post('/signup')
        .send(registerAttemptShortPassword)
        .expect(400, {error: 'Password must be longer than 8 characters'});
    });

    it('responds with 400 "Password must be shorter than 72 characters" if password is too long', () => {
      const registerAttemptLongPassword = {
        password: '12345678910111213141516171819202122232425262728293031323334353637383940!',
        id: 4,
        team_id: testTeams[0].id,
        user_name: 'test-user-brand-new',
      };

      return supertest(app)
        .post('/signup')
        .send(registerAttemptLongPassword)
        .expect(400, {error: 'Password must be shorter than 72 characters'});
    });

    it('responds with 400 "Password must not start or end with empty spaces" if password begins with empty spaces', () => {
      const registerAttemptSpaceBeforePassword = {
        password: ' Abc123DoReMi!',
        id: 4,
        team_id: testTeams[0].id,
        user_name: 'test-user-brand-new',
      };

      return supertest(app)
        .post('/signup')
        .send(registerAttemptSpaceBeforePassword)
        .expect(400, {error: 'Password must not start or end with empty spaces'});
    });

    it('responds with 400 "Password must not start or end with empty spaces" if password ends with empty spaces', () => {
      const registerAttemptSpaceAfterPassword = {
        password: 'Abc123DoReMi! ',
        id: 4,
        team_id: testTeams[0].id,
        user_name: 'test-user-brand-new',
      };

      return supertest(app)
        .post('/signup')
        .send(registerAttemptSpaceAfterPassword)
        .expect(400, {error: 'Password must not start or end with empty spaces'});
    });

    it('responds with 400 when password is not sufficiently complex', () => {
      const registerAttemptSimplePassword = {
        password: 'password!',
        id: 4,
        team_id: testTeams[0].id,
        user_name: 'test-user-brand-new',
      }; 

      return supertest(app)
        .post('/signup')
        .send(registerAttemptSimplePassword)
        .expect(400, {error: 'Password must contain 1 upper case, lower case, number and special character'});
    });

    it('responds with 400 "User name is already taken" when user_name already exists in the database', () => {
      const registerAttemptDuplicateUser = {
        user_name: testUsers[0].user_name,
        password: 'Abc123DoReMi!',
        id: 4,
        team_id: testTeams[0].id,
      }; 

      return supertest(app)
        .post('/signup')
        .send(registerAttemptDuplicateUser)
        .expect(400, {error: 'User name is already taken'});
    });

    it('responds 201, serialized user, storing bcrypted password', () => {
        
      const newUser = {
        user_name: 'ValidUserName',
        password: 'Abc123DoReMi!',
        id: 4,
        team_id: testTeams[0].id,
      };

      return supertest(app)
        .post('/signup')
        .send(newUser)
        .expect(201)
        .expect(res => {
          db
            .from('gofetch_users')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.user_name).to.eql(newUser.user_name);
              expect(res.body).to.not.have.property('password');
              return bcrypt.compare(newUser.password, row.password)
                .then(compare => expect(compare).to.be.true);

            });
          
        });

    });

  });
});