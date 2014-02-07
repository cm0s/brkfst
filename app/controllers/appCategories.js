'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  AppCategory = mongoose.model('AppCategory'),
  App = mongoose.model('App'),
  errors = require('../errors');

/**
 * List all AppCategories
 * Available query parameters:
 *  expand : will add and populate associated AppCategory's apps
 */
exports.all = function (req, res) {
  var expand = req.query.expand;

  if (expand === 'true') {
    AppCategory.listWithAppsPopulated(function (err, appCategories) {
      if (err) {
        errors.serverError();
      } else {
        res.json(appCategories);
      }
    });
  } else {
    AppCategory.list(function (err, appCategories) {
      if (err) {
        errors.serverError();
      } else {
        res.json(appCategories);
      }
    });
  }
};
/**
 * Create a new AppCategory
 */
exports.create = function (req, res) {
  var appCategory = new AppCategory(req.body);

  appCategory.save(function (err) {
    if (err) {
      if (err.name === 'ValidationError') {
        return res.send(422, {
          errors: err.errors,
          appCategory: appCategory
        });
      }
    } else {
      res.status(201).json(appCategory);
    }
  });
};
