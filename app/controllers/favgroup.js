'use strict';

var Favgroup = require('../models/favgroup'),
  App = require('../models/app'),
  errors = require('../errors'),
  util = require('util'),
  logger = require('../../config/logger'),
  async = require('async'),
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

/**
 * Add an App to the logged user's default Favgroup
 */
exports.addApp = function (req, res) {
  async.waterfall([
    //Retrieve Favgroup
    function (callback) {
      var isDefault = 0;
      if (req.params.favgroup_id === 'default') {
        isDefault = 1;
      }
      Favgroup.findOne({is_default: isDefault}, function (err, favgroup) {
        if (err) {
          logger.error(err.message);
          errors.serverError(res, err.message);
        }
        callback(null, favgroup);
      });
    },

    //Retrieve App
    function (favgroup, callback) {
      var appId = req.params.app_id;

      if (!_.isFinite(_.parseInt(appId))) {
        errors.badRequest(res, 'Application id [' + appId + '] is not a valid id');
      }
      App.findById(appId, function (err, app) {
        if (err) {
          //TODO use the winston extend feature in order to automatically add log when calling serverError.
          logger.error(err.message);
          errors.serverError(res, err.message);
        }
        callback(null, favgroup, app);
      });
    },

    //Add the app into the favgroup
    function (favgroup, app, callback) {
      favgroup.addApp(app.id, function (err, app) {
        if (err) {
          //TODO use the winston extend feature in order to automatically add log when calling serverError.
          logger.error(err.message);
          errors.serverError(res, err.message);
        }
        callback(null, app);
      });
    }
  ], function (err, app) {
    res.json(app);
  });
};

exports.removeApp = function (req, res) {
  req.assert('app_id', 'Should be a number').isInt();
  req.assert('favgroup_id', 'Should be a number').isInt();

  var reqErrors = req.validationErrors();
  if (reqErrors) {
    errors.badRequest(res, reqErrors);
    return;
  }

  Favgroup.findOne({id: req.params.favgroup_id}, function (err, favgroup) {
    if (err) {
      errors.serverError(res, err);
      return;
    }
    if (!favgroup) {
      errors.notFound(res, {error: 'Favgroup not found: ' + req.params.favgroup_id});
      return;
    }
    favgroup.removeApp(req.params.app_id, function (err, results) {
      if (err) {
        errors.serverError(res, err);
        return;
      }
      if (!results) {
        errors.notFound(res, {error: 'App not found: ' + req.params.app_id});
        return;
      }
      res.json(204, null);
    });
  });
};

exports.create = function (req, res) {
//implement it
};