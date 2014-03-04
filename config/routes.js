'use strict';

var auth = require('./middlewares/authorization'),
  users = require('../app/controllers/users'),
  errors = require('../app/errors');

module.exports = function (app, passport) {

  //Login form page
  app.get('/login', users.signin);

  //Auto login which use the uniqueId HTTP header attribute to authenticate the user.
  app.post('/login', function (req, res, next) {
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
        return res.redirect('/');
      });
    })(req, res, next));
  });

  //Auto login which use the uniqueId HTTP header attribute to authenticate the user.
  app.get('/auto-login', function (req, res, next) {
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

  /**
   /* API
   **/
  //apps
  var appCtrl = require('../app/controllers/app');
  app.get('/api/apps', appCtrl.findAll);
  app.post('/api/apps', appCtrl.create);

  //categories
  var categoryCtrl = require('../app/controllers/category');
  app.get('/api/categories', categoryCtrl.findAll);

  //favgroups
  var favgroupCtrl = require('../app/controllers/favgroup');
  app.get('/api/favgroups', favgroupCtrl.findAll);
  app.post('/api/favgroups/:favgroup_id/apps/:app_id', favgroupCtrl.addApp);
  app.put('/api/favgroups/:id', favgroupCtrl.update);
  app.put('/api/favgroups/:id/apps', favgroupCtrl.updateAppsPosition);
  app.delete('/api/favgroups/:favgroup_id/apps/:app_id', favgroupCtrl.removeApp);


  //Localization
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
