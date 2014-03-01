var mysql = require('mysql'),
  config = require('./config'),
  conn = mysql.createConnection(config.db),
  _ = require('lodash');

exports.conn = conn;

conn._insert = function (table, fields, callback) {
  var keys = Object.keys(fields);
  var values = keys.map(function (k) {
    return fields[k];
  });
  var placeholders = keys.map(function () {
    return '?';
  });
  var querystring
    = 'INSERT INTO `' + table + '` ' +
    '(' + keys.join(', ') + ') ' +
    'VALUES ' + '(' + placeholders.join(', ') + ')';

  conn.query(querystring, values, callback);
};

conn._upsert = function (table, fields, callback) {
  if (!fields.id) {
    return conn._insert(table, fields, callback);
  }

  var values = [],
    keys = [];

  _.forEach(fields, function (value, key) {
    values.push(value);
    keys.push(key);
  });

  var querystring
    = 'UPDATE `' + table + '` SET ' +
    keys.map(function (k) {
      return k + ' = ?';
    }).join(', ') +
    ' WHERE id = ?';

  values.push(fields.id);
  conn.query(querystring, values, callback);
};