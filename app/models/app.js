'use strict';

var conn = require('../../config/mysql').conn,
  Base = require('./mysql-base');

var App = function App(attributes) {
  this.attributes = attributes;
};

Base.apply(App, 'app');

module.exports = App;

