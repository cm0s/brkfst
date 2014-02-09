'use strict';

var _ = require('lodash');

// Load app configuration

module.exports = _.extend(
  //TODO pur back those line once the dev, prod and all file are correctly set
  //require(__dirname + '/../config/env/all.js'),
  //require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js') || {}
  require(__dirname + '/../config/env/temporary.js')
);
