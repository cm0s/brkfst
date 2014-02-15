'use strict';

var _ = require('lodash'),
  errors = require('../../app/errors');


exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //Keep the visited page in the request session in order
    //to redirect to this page after a successful login.
    req.session.returnTo = req.path;
    return res.redirect('/login');
  }
  errors.unauthorized(res, 'User is not authorized');
};