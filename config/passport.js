'use strict';

var LocalStrategy = require('passport-local').Strategy,
  User = require('../app/models/user');

module.exports = function (passport) {

  passport.use(new LocalStrategy(function (username, passowrd, done) {
    User.findOne({shib_uid: username}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Unknown user'
        });
      }

      //There is no password check because the user is already
      // authenticated by Shibboleth

      return done(null, user);
    });
  }));

  // Serialize the user id to push into the session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize the user object based on a pre-serialized token
  // which is the user id
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });


};