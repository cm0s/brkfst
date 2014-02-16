'use strict';

var auth = require('./middlewares/authorization'),
  users = require('../app/controllers/users'),
  errors = require('../app/errors');

module.exports = function (app, passport) {
  //app.all('*', auth.isAuthenticated);

  app.get('/login', function (req, res, next) {
    //Authentication is handled by Shibboleth, thus the only thing we need to check
    //is whether there is a user entry in the database which has the uniqueid
    //passed in the header.
    req.body.username = req.headers.uniqueid;
    //LocalStrategy need a password to work otherwise a MissingCredential error is
    //raised. This password is just not verified.
    req.body.password = 'fakepassword';

    //TODO replace the passport-local strategy by a custom strategy which doesn't check the password.
    //This way, it will not be necessary to set a "fake password".
    (passport.authenticate('local', function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        console.log('ERROR: Cannot login, there is no user with uniqueId [' + req.headers.uniqueid + '] in the DB');
        return res.send(401, 'User not authorized, invalid uniqueId');
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect(req.session.returnTo || '/');
      });
    })(req, res, next));
  });

  //User Routes
  app.get('/users/me', users.me);

  //Finish with setting up the userId param
  app.param('userId', users.user);

  /**
   /* API
   **/
  //apps routes
  var appCtrl = require('../app/controllers/app');
  app.get('/api/apps', appCtrl.findAll);
  app.post('/api/apps', appCtrl.create);

  //categories routes
  var categoryCtrl = require('../app/controllers/category');
  app.get('/api/categories', categoryCtrl.findAll);

  //favgroups routes
  var favgroupCtrl = require('../app/controllers/favgroup');
  app.get('/api/favgroups', favgroupCtrl.findAll);

  //User pinnedApps routes
  // app.post('/api/users/me/pinnedAppsGroup/:groupId/pinnedApps/:appId', users.pinApp);

  //PinnedApps group
  //app.post('/api/pinnedAppsGroup', users.createGroup);

  //Localization routes
  var locale = require('../app/controllers/locale');
  app.get('/api/locale', locale.render);

  /**
   /* Pages
   **/
  //Home route
  var index = require('../app/controllers/index');
  app.get('/', auth.isAuthenticated, index.render);
  app.get('*', auth.isAuthenticated, index.render);

};
