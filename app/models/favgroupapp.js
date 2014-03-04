'use strict';

var conn = require('../../config/mysql').conn,
  Base = require('./mysql-base'),
  _ = require('lodash'),
  async = require('async');

//Model for the favgroup_app join table
var FavgroupApp = function FavgroupApp(attributes) {
  var self = this;
  _.forEach(attributes, function (value, key) {
    self[key] = value;
  });
};

Base.apply(FavgroupApp, 'favgroup_app');

module.exports = FavgroupApp;

