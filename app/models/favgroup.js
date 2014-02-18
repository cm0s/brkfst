'use strict';

var conn = require('../../config/mysql').conn,
  Base = require('./mysql-base'),
  _ = require('lodash'),
  async = require('async');

var Favgroup = function Favgroup(attributes) {
  var self = this;
  _.forEach(attributes, function (value, key) {
    self[key] = value;
  });
};

//Model for the favgroup_app join table
var FavgroupApp = function FavgroupApp(attributes) {
  var self = this;
  _.forEach(attributes, function (value, key) {
    self[key] = value;
  });
};

Favgroup.findAllwithEmbeddedApps = function (callback) {
  async.waterfall([
    function (callback) {
      conn.query({
        sql: 'SELECT * FROM favgroup JOIN favgroup_app ON ' +
          'favgroup_app.favgroup_id = favgroup.id JOIN app ON app.id = favgroup_app.app_id',
        nestTables: true
      }, function (err, rows) {
        if (err) {
          return callback(err);
        }
        callback(null, rows.map(Favgroup.fromDbResult));
      });
    },
    function (rows, callback) {
      var objData = {};
      _.forEach(rows, function (row) {
        var favgroupId = row.favgroup.id;
        //Add a property for each favgroup (only add the favgroup one time)
        if (!_.has(objData, favgroupId)) {
          //Add properties to the objData
          objData[favgroupId] = row.favgroup;
          objData[favgroupId].apps = [];
        }
        objData[favgroupId].apps.push(row.app);
      });
      var arrData = _.toArray(objData);
      callback(null, arrData);
    }
  ], function (err, arrData) {
    callback(err, arrData);
  });
};

Base.apply(Favgroup, 'favgroup');
Base.apply(FavgroupApp, 'favgroup_app');

Favgroup.prototype.getAppById = function getAppById(id, callback) {
  FavgroupApp.findOne({favgroup_id: this.id, app_id: id}, function (err, favgroupApp) {
    if (err) {
      return callback(err);
    }

    callback(null, favgroupApp);
  });
};

Favgroup.prototype.addApp = function getAppById(id, callback) {
  var favgroupApp = new FavgroupApp({
    app_id: id,
    favgroup_id: this.id
  });
  favgroupApp.save(function (err, favGroup) {
    if (err) {
      return callback(err);
    }
    callback(null, favGroup);
  });
};

Favgroup.prototype.is_default = function isDefault() {
  return false;
};


module.exports = Favgroup;

