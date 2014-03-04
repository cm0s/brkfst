'use strict';

var Favgroup = require('../models/favgroup'),
  FavgroupApp = require('../models/favgroupapp'),
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
 * Add an App to a user's Favgroup
 * request parameters :
 * app_id : App id to add to the Favgroup;
 * favgroup_id: Favgroup id where the App is added (value default can be used instead of an id in order to add the App
 * to the user's default Favroup)
 */
exports.addApp = function (req, res) {
  async.waterfall([
    //Retrieve Favgroup
    function (callback) {
      var favgroupId = req.params.favgroup_id;
      var query = { id: favgroupId };
      if (favgroupId === 'default') {
        query = {is_default: 1};
      }

      Favgroup.findOne(query, function (err, favgroup) {
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

exports.updateAppsPosition = function (req, res) {
  req.checkParams('id', 'Should be a number').isInt();
  req.sanitize('id').toInt();

  var favgroupId = req.params.id,
    apps = req.body;

  var favgroup = new Favgroup({
    id: favgroupId
  });

  var favgroupAppFunctions = [];
  _.forEach(apps, function (app, position) {
    favgroupAppFunctions.push(
      function (callback) {
        FavgroupApp.findOne({app_id: app.id, favgroup_id: favgroupId}, function (err, favgroupApp) {
          if (favgroupApp) {
            favgroup.updateAppPosition(app.id, position, function (err, favgroupApp) {
              if (err) {
                callback(err);
              }
              callback(null, favgroupApp);
            });
          }
          if (!favgroupApp) {
            var newFavgroupApp = new FavgroupApp({
              app_id: app.id,
              favgroup_id: favgroupId,
              position: position
            });
            newFavgroupApp.save();
          }
        });

      }
    );
  });
  async.parallel(favgroupAppFunctions, function (err, favgroupApps) {
    if (err) {
      errors.serverError(res, err);
    }
    res.json(204, null);
  });
};

exports.update = function (req, res) {
  req.checkParams('id', 'Should be a number').isInt();
  req.checkBody('id', 'Should be a number').isInt();
  req.checkBody('title', 'Should be a number').notEmpty();
  req.checkBody('userId', 'Should be a number').isInt();
  req.sanitize('isDefault').toBoolean();
  req.sanitize('title').toString();
  req.sanitize('id').toInt();
  req.sanitize('userId').toInt();

  var reqErrors = req.validationErrors();
  if (reqErrors) {
    errors.badRequest(res, reqErrors);
    return;
  }

  var favgroup = new Favgroup({
    id: req.body.id,
    title: req.body.title,
    user_id: req.body.userId,
    is_default: req.body.isDefault
  });
  favgroup.save(function (err, updatedFavgroup) {
      res.json(updatedFavgroup);
    }
  );
}
;

exports.create = function (req, res) {
//implement it
};