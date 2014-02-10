'use strict';

var App = require('../models/app'),
  errors = require('../errors');

exports.findAll = function (req, res) {
  var expand = req.query.expand;
  App.findAll(function (err, apps) {
    if (err) {
      errors.serverError(res, err.message);
    } else {
      res.json(apps);
    }
  });
};

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