'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  _ = require('lodash'),
  authTypes = ['github', 'twitter', 'facebook', 'google'];

var PinnedAppsGroupSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  apps: [
    {
      type: Schema.ObjectId,
      ref: 'App'
    }
  ]
});

/**
 * User Schema
 */
var UserSchema = new Schema({
  name: String,
  email: String,
  username: {
    type: String,
    unique: true
  },
  hashed_password: String,
  provider: String,
  salt: String,
  facebook: {},
  twitter: {},
  github: {},
  google: {},
  pinnedAppsGroups: [PinnedAppsGroupSchema]
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function (password) {
  this._password = password;
  this.salt = this.makeSalt();
  this.hashed_password = this.encryptPassword(password);
}).get(function () {
  return this._password;
});

/**
 * Validations
 */
var validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally
UserSchema.path('name').validate(function (name) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('username').validate(function (username) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  // if you are authenticating by any of the oauth strategies, don't validate
  if (authTypes.indexOf(this.provider) !== -1) return true;
  return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && authTypes.indexOf(this.provider) === -1)
    next(new Error('Invalid password'));
  else
    next();
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  },

  /**
   * Get the list of App pinned by the user
   * @return {Array}
   */
  getPinnedApps: function () {
    var pinnedApps = [];
    _.forEach(this.pinnedAppsGroups, function (pinnedAppsGroup) {
      _.forEach(pinnedAppsGroup.apps, function (app) {
        //Avoid duplicate object (we don't want to list the same app twice)
        if (_.find(pinnedApps, app) === undefined) {
          pinnedApps.push(app);
        }
      });
    });
    return pinnedApps;
  }
};

UserSchema.statics = {
  byId: function (userId, callback) {
    var query = this.findOne({_id: userId});
    query
      .populate('pinnedAppsGroups.apps')
      .exec(callback);
  },
  pinApp: function (userId, groupId, app, callback) {
    this.findOne({_id: userId})
      .populate('pinnedAppsGroups.apps')
      .exec(function (err, user) {
        var pinnedAppsGroupIndex = _.findIndex(user.pinnedAppsGroups, {'_doc': {'cid': groupId}});
        if (pinnedAppsGroupIndex === -1) {
          callback(new Error('There is no group with id: [' + groupId + ']'), null);
        } else {
          var pinnedAppsGroup = user.pinnedAppsGroups[pinnedAppsGroupIndex];
          var pinnedAppIndex = _.findIndex(pinnedAppsGroup.apps, {_id: app.id});
          if (pinnedAppIndex === -1) {
            pinnedAppsGroup.apps.push(app);
            pinnedAppsGroup.save(function (err) {
              callback(err, app);
            });
          } else {
            callback(new Error('There is already an app with id: [' + app.id + '] in the group with id: [' + groupId + ']'), null);
          }
        }
      });
  }
};


mongoose.model('User', UserSchema);
mongoose.model('PinnedAppsGroup', PinnedAppsGroupSchema);