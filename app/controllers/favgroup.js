'use strict';

var Favgroup = require('../models/favgroup'),
  errors = require('../errors'),
  _ = require('lodash');

exports.findAll = function (req, res) {
  var embed = req.query.embed;

  if (embed === 'apps') {
    Favgroup.findAllwithEmbeddedApps(function (err, results) {
      if (err) {
        errors.serverError(res, err.message);
      } else {
        res.json(results);
      }
    });
  } else if (_.isEmpty(embed)) {
    Favgroup.findAll(function (err, apps) {
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