'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  App = mongoose.model('App'),
  errors = require('../errors');

/**
 * List all PinnedAppsGroups for a given user
 */
exports.allByUser = function (req, res) {
  var expand = req.query.expand;
  App.list(expand, function (err, apps) {
    if (err) {
      errors.serverError();
    } else {
      res.json(apps);
    }
  });
};