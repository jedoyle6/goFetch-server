'use strict';
module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_URL: process.env.DB_URL || 'postgresql://postgres@localhost/gofetch',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-web-token',
  TEST_DB_URL: 'postgresql://postgres@localhost/gofetch_test',
};