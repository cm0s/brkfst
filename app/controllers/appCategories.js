'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  AppCategory = mongoose.model('AppCategory'),
  App = mongoose.model('App'),
  errors = require('../errors');


/**
 * List all AppCategories
 */
exports.all = function (req, res) {
  //Function needed in order to send the http response only once all
  //the appCategories' apps has been retrieved and added to the returned json document.
  function response(appCategories) {
    res.json(appCategories);
  }

  var expand = req.query.expand;
  AppCategory.list(expand, function (err, appCategories) {
    if (err) {
      errors.serverError();
    } else {
      _.forEach(appCategories, function (category, index) {
        category.apps = [];
        App.byCategory(category._id, function (err, apps) {
          category.apps = category.apps.concat(apps);
          if (index === appCategories.length - 1) {
            response(appCategories);
          }
        });
      });
    }
  });
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
