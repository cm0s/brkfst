'use strict';

var Category = require('../models/category'),
  errors = require('../errors'),
  _ = require('lodash');

exports.findAll = function (req, res) {
  var embed = req.query.embed;

  if (embed === 'apps') {
    Category.findAllwithEmbeddedApps(function (err, results) {
      res.json(results);
    });
  } else if (_.isEmpty(embed)) {
    Category.findAll(function (err, apps) {
      if (err) {
        errors.serverError(res, err.message);
      } else {
        res.json(apps);
      }
    });
  } else {
    errors.badRequest(res);
  }
};

exports.create = function (req, res) {
//implement it
};