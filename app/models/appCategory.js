'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  _ = require('lodash'),
  Schema = mongoose.Schema,
  async = require('async'),
  App = mongoose.model('App');

/**
 * AppCategory Schema
 */
var AppCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  }
});

AppCategorySchema.statics = {
  list: function (callback) {
    this.find()
      .lean()
      .sort('title')
      .exec(callback);
  },

  listWithAppsPopulated: function (callback) {
    this.find()
      .lean()
      .sort('title')
      .exec(function (err, appCategories) {
        var populateFunctionArray = [];
        _.forEach(appCategories, function (category, index) {
          //Create an array of populate function which will be run after in parallel
          populateFunctionArray.push(
            function (callback) {
              App.byCategory(category._id, function (err, apps) {
                callback(null, apps);
              });
            }
          );
        });
        //Run each populate function located in the populateFunctionArray and once all functions execution are
        //terminated executed a call back which has as parameter a results array which contains all populate function
        //results
        async.parallel(populateFunctionArray, function (err, results) {
          _.forEach(appCategories, function (category, index) {
            category.apps = results[index];
          });
          // }
          callback(err, appCategories);
        });
      }
    );
  }
};

mongoose.model('AppCategory', AppCategorySchema);
