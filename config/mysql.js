var mysql = require('mysql'),
  config = require('./config'),
  conn = mysql.createConnection(config.db);

exports.conn = conn;