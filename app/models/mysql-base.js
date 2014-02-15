'use strict';

var conn = require('../../config/mysql').conn;

var Base = function () {
};

Base.apply = function apply(Model, table) {

  Model.findAll = function findAll(callback) {
    conn.query('SELECT * FROM ' + table, function (err, results) {
      if (err) return callback(err);
      else callback(null, results);
    });
  };

  Model.find = function find(criteria, callback) {
    var finders = Model.finders || {};
    var keys = Object.keys(criteria);
    var firstKey = keys[0];
    var values = keys.map(function (key) {
      return criteria[key];
    });
    var qstring = 'SELECT * FROM `' + table + '` WHERE ' + keys.map(function (key) {
      return (key + ' = ?');
    }).join(' AND ');

    if (keys.length === 1 && firstKey in finders) {
      return Model.finders[firstKey](criteria[firstKey]);
    }
    conn.query(qstring, values, function (err, results) {
      callback(err, results);
    });
  };

  Model.findOne = function (criteria, callback) {
    Model.find(criteria, function (err, results) {
      if (err) return callback(err);
      callback(null, results.pop());
    });
  };

  Model.findById = function (id, callback) {
    Model.findOne({id: id}, callback);
  };

  Model.prototype = new Base();
  Model.prototype.model = Model;
  Model.prototype.conn = conn;
};

module.exports = Base;