'use strict';

var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  db: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'brkfst'
  },
  app: {
    name: 'Brkfst'
  }
};