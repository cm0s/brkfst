'use strict';

var conn = require('../../config/mysql').conn,
  async = require('async'),
  _ = require('lodash'),
  Base = require('./mysql-base');

var User = function User(attributes) {
  var self = this;
  _.forEach(attributes, function (value, key) {
    self[key] = value;
  });
};

User.findByUId = function (id, callback) {
  User.findOne({shib_uid: id}, callback);
};

//TODO use nodejs util.inherits module
Base.apply(User, 'user');

module.exports = User;

