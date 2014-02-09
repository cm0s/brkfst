'use strict';

/**
 * Module dependencies.
 */
var App = require('../models/app2'),
  errors = require('../errors');

/**
 * List all Apps
 */
exports.all = function (req, res) {
  var expand = req.query.expand;
  App.findAll(function (err, apps) {
    if (err) {
      errors.serverError(res, err.message);
    } else {
      res.json(apps);
    }
  });
};