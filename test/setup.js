/* eslint-disable strict */
process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.TEST_DB_URL = 'postgresql://postgres@localhost/gofetch_test';

require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;