'use strict';

module.exports = function (app, passport, auth) {
  //User Routes
  var users = require('../app/controllers/users');
  app.get('/signin', users.signin);
  app.get('/signup', users.signup);
  app.get('/signout', users.signout);
  app.get('/users/me', users.me);

  //Setting up the users api
  app.post('/users', users.create);

  //Setting the local strategy route
  app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), users.session);

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Setting the github oauth routes
  app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.signin);

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Setting the google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }), users.signin);

  app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
  }), users.authCallback);

  //Finish with setting up the userId param
  app.param('userId', users.user);

  /**
   /* API
   **/
  //Apps routes
  var appsCtrl = require('../app/controllers/apps');
  app.get('/api/apps', appsCtrl.all);
  app.post('/api/apps', appsCtrl.create);

  //AppCategories routes
  var appCategoriesCtrl = require('../app/controllers/appCategories');
  app.get('/api/appCategories', appCategoriesCtrl.all);
  app.post('/api/appCategories', appCategoriesCtrl.create);

  //User routes
  app.get('/api/users/me', users.currentUser);
  app.get('/api/users/me/apps', users.currentUserApps);
  app.get('/api/users/me/appCategories', users.currentUserAppCategories);

  //User pinnedApps routes
  app.post('/api/users/me/pinnedAppsGroup/:groupId/pinnedApps/:appId', users.pinApp);

  //PinnedApps group
  app.post('/api/pinnedAppsGroup', users.createGroup);

  //Localization routes
  var locale = require('../app/controllers/locale');
  app.get('/api/locale', locale.render);

  /**
   /* Pages
   **/
  //Home route
  var index = require('../app/controllers/index');
  app.get('/', index.render);
  app.get('*', index.render);

};
