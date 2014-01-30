'use strict';

var mongoose = require('mongoose'),
  _ = require('lodash'),
  async = require('async'),
  AppCategory = mongoose.model('AppCategory'),
  App = mongoose.model('App'),
  errors = require('../errors');

/**
 * List all AppCategories
 */
exports.all = function (req, res) {
  var expand = req.query.expand;
  AppCategory.list(expand, function (err, appCategories) {
    if (err) {
      errors.serverError();
    } else {
      //The list of apps associated to each appCategories must be populated (we cannot use the mongoose populate
      //function because the AppCategory model doesn't hold references to the associated apps).
      //So, an asynchronous call to retrieve the apps must be performed for each appCategories.
      //However, it's not possible to populate the appCategories' apps array inside a loop because
      //of the asynchronous nature of the call to retrieve the apps in the DB. To overcome this problem
      //the parallel util of the async library is used in order to parallelize the asynchronous call made
      //on the DB and thus be able to populate the appCategories' apps array only once all the apps are
      //retrieved from the DB.
      var populateFunctionArray = [];
      _.forEach(appCategories, function (category, index) {
        populateFunctionArray.push(
          function (callback) {
            App.byCategory(category._id, function (err, apps) {
              callback(null, apps);
            });
          }
        );
      });
      async.parallel(populateFunctionArray, function (err, results) {
        _.forEach(appCategories, function (category, index) {
          category.apps = results[index];
        });
        res.json(appCategories);
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
