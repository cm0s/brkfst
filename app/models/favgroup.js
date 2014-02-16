'use strict';

var conn = require('../../config/mysql').conn,
  Base = require('./mysql-base'),
  _ = require('lodash'),
  async = require('async');

var Favgroup = function Favgroup(attributes) {
  this.attributes = attributes;
};

Favgroup.findAllwithEmbeddedApps = function (callback) {
  async.waterfall([
    function (callback) {
      conn.query({
        sql: 'SELECT * FROM favgroup JOIN favgroup_app ON ' +
          'favgroup_app.favgroup_id = favgroup.id JOIN app ON app.id = favgroup_app.app_id',
        nestTables: true
      }, function (err, rows) {
        callback(err, rows);
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

module.exports = Favgroup;

