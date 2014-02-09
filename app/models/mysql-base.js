'use strict';

var conn = require('../../config/mysql').conn;

var Base = function () {
};

Base.apply = function apply(Model, table) {
  Model.findAll = function findAll(callback) {
    conn.query('SELECT * FROM ' + table, function (err, results) {
      if (err) callback(err);
      else callback(null, results);
    });
  };

  Model.findOne = function (criteria, callback) {
    Model.find(criteria, function (err, results) {
      if (err)
        return callback(err);
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