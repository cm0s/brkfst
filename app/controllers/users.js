'use strict';

/**
 * Module dependencies.
 */
var errors = require('../errors'),
  _ = require('lodash');

/**
 * Auth callback
 */
exports.authCallback = function (req, res) {
  res.redirect('/');
};


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
  /* User
   .findOne({
   _id: id
   })
   .exec(function (err, user) {
   if (err) return next(err);
   if (!user) return next(new Error('Failed to load User ' + id));
   req.profile = user;
   next();
   });*/
  next();
};