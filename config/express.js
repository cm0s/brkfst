'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
  flash = require('connect-flash'),
  helpers = require('view-helpers'),
  config = require('./config'),
  expressValidator = require('express-validator'),
  _ = require('lodash'),
  User = require('../app/models/user');

module.exports = function (app, passport) {
  app.set('showStackError', true);

  //Prettify HTML
  app.locals.pretty = true;

  //Should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  //Don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(express.logger('dev'));
  }

  //Set views path, template engine and default layout
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'jade');

  //Enable jsonp
  app.enable('jsonp callback');

  app.configure(function () {
    //cookieParser should be above session
    app.use(express.cookieParser());

    app.use(express.bodyParser());
    app.use(expressValidator());
    app.use(express.urlencoded());
    app.use(express.json());
    //request body parsing middleware should be above methodOverride
    app.use(express.methodOverride());

    app.use(express.session({
      secret: '4ef2aa00bd41f2f915d63dc65aa6eb96'
    }));

    // Initialize passport and activate session
    app.use(passport.initialize());
    app.use(passport.session());

    //connect flash for flash messages
    app.use(flash());

    //dynamic helpers
    app.use(helpers(config.app.name));

    //Setting the fav icon and static folder
    app.use(express.favicon());
    app.use('/public', express.static(config.root + '/public'));

    //routes should be at the last
    app.use(app.router);

    //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
      //Treat as 404
      if (~err.message.indexOf('not found')) return next();

      //Log it
      console.error(err.stack);

      //Error page
      res.status(500).render('500', {
        error: err.stack
      });
    });

    //Assume 404 since no middleware responded
    app.use(function (req, res, next) {
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      });
    });

  });
};