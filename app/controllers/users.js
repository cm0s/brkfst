'use strict';

/**
 * Module dependencies.
 */
var errors = require('../errors'),
  _ = require('lodash');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  /*  var user = new User(req.body);
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
   });*/
  return res.redirect('/');
};