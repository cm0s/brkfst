'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  App = mongoose.model('App'),
  PinnedAppsGroup = mongoose.model('PinnedAppsGroup'),
  AppCategory = mongoose.model('AppCategory'),
  errors = require('../errors'),
  _ = require('lodash');

/**
 * Auth callback
 */
exports.authCallback = function (req, res) {
  res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function (req, res) {
  res.render('users/signin', {
    title: 'Signin',
    message: req.flash('error')
  });
};

/**
 * Show sign up form
 */
exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * Session
 */
exports.session = function (req, res) {
  res.redirect('/');
};

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var user = new User(req.body);
  var message = null;

  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      switch (err.code) {
        case 11000:
        case 11001:
          message = 'Username already exists';
          break;
        default:
          message = 'Please fill all the required fields';
      }

      return res.render('users/signup', {
        message: message,
        user: user
      });
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  });
};

/**
 * Send User
 */
exports.me = function (req, res) {
  res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function (req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .exec(function (err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    });
};

/**
 * Find logged user in DB
 * Replace the exports.me function in order to be able to run the populate
 * option on the User model query to mongodb (will be replaced later)
 */
exports.currentUser = function (req, res) {
  User.byId(req.user.id, function (err, user) {
    if (err) {
      errors.serverError();
    } else {
      res.jsonp(user);
    }
  });
};

exports.currentUserAppCategories = function (req, res) {
  User.byId(req.user.id, function (err, user) {
    if (err) {
      errors.serverError();
    } else {
      var expand = req.query.expand;
      var userPinnedApps = user.getPinnedApps();

      //TODO replace by a list which contains only the apps/appCategories the user can READ
      //(roles and permissions must be implemented first).
      AppCategory.listWithAppsPopulated(function (err, appCategories) {
        if (err) {
          errors.serverError();
        } else {
          _.forEach(appCategories, function (appCategory, appCategoryIndex) {
            //Add a isPinned property to the document which indicated if this document is pinned by the user.
            _.forEach(appCategory.apps, function (app, appIndex) {
              appCategories[appCategoryIndex].apps[appIndex]._doc.isPinned = false;
              _.forEach(userPinnedApps, function (userPinnedApp) {
                if (userPinnedApp.equals(app)) {
                  appCategories[appCategoryIndex].apps[appIndex]._doc.isPinned = true;
                }
              });
            });
          });
          res.json(appCategories);
        }
      });
    }
  });
};

exports.currentUserApps = function (req, res) {
  User.byId(req.user.id, function (err, user) {
    if (err) {
      errors.serverError();
    } else {
      var expand = req.query.expand;
      var userPinnedApps = user.getPinnedApps();
      //TODO replace by a list which contains only the apps the user can READ
      //(roles and permissions must be implemented first).
      App.list(expand, function (err, apps) {
        if (err) {
          errors.serverError();
        } else {
          //Add a isPinned property to the document which indicated if this document is pinned by the user.
          _.forEach(apps, function (app, index) {
            apps[index]._doc.isPinned = false;
            _.forEach(userPinnedApps, function (userPinnedApp) {
              if (userPinnedApp.equals(app)) {
                apps[index]._doc.isPinned = true;
              }
            });

          });
          res.json(apps);
        }
      });
    }
  });
};

exports.pinApp = function (req, res) {
  var groupId = req.params.groupId;
  var appId = req.params.appId;

  App.findOne({_id: appId}, function (err, app) {
    if (err) {
      errors.serverError();
    } else {
      User.pinApp('52ed615a837a670c0c2dc82c', groupId, app, function (err, app) {
        if (err) {
          return errors.serverError(res, err.message);
        } else {
          res.json(app);
        }
      });
    }
  });
};

exports.createGroup = function (req, res) {
  var group = new PinnedAppsGroup({
    title: 'Group test99',
    apps: [
      {
        '$oid': '52d9b5375b1b3b5cda9c0e61'
      },
      {
        '$oid': '52d9b5375b1b3b5cda9c0e6e'
      }
    ]
  });
  group.save(function (err) {
    res.json(group);
  });
};