'use strict';

var conn = require('../../config/mysql').conn,
  Base = require('./mysql-base'),
  _ = require('lodash');

var App = function App(attributes) {
  var self = this;
  _.forEach(attributes, function (value, key) {
    self[key] = value;
  });
};

Base.apply(App, 'app');

module.exports = App;

