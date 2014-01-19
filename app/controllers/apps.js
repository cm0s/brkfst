'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  App = mongoose.model('App'),
  errors = require('../errors');



/**
 * List all Apps
 */
exports.all = function (req, res) {
  var expand = req.query.expand;
  App.list(expand, function (err, apps) {
    if (err) {
      errors.serverError();
    } else {
      res.json(apps);
    }
  });
};

/**
 * Create a new App
 */
exports.create = function (req, res) {
  var app = new App(req.body);

  app.save(function (err) {
    if (err) {
      if (err.name === 'ValidationError') {
        return res.send(422, {
          errors: err.errors,
          app: app
        });
      }
    } else {
      res.status(201).json(app);
    }
  });
};