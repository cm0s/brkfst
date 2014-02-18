'use strict';

var conn = require('../../config/mysql').conn,
  async = require('async'),
  _ = require('lodash'),
  Base = require('./mysql-base');

var Category = function Category(attributes) {
  var self = this;
  _.forEach(attributes, function (value, key) {
    self[key] = value;
  });
};

Category.findAllwithEmbeddedApps = function (callback) {
  async.waterfall([
    function (callback) {
      conn.query({
        sql: 'SELECT * FROM category JOIN category_app ON ' +
          'category_app.category_id = category.id JOIN app ON app.id = category_app.app_id',
        nestTables: true
      }, function (err, rows) {
        if (err) {
          return callback(err);
        }
        callback(null, rows.map(Category.fromDbResult));
      });
    },
    function (rows, callback) {
      var objData = {};
      _.forEach(rows, function (row) {
        var categoryId = row.category.id;
        //Add a property for each category (only add the category one time)
        if (!_.has(objData, categoryId)) {
          //Add properties to the objData
          objData[categoryId] = row.category;
          objData[categoryId].apps = [];
        }
        objData[categoryId].apps.push(row.app);
      });
      var arrData = _.toArray(objData);
      callback(null, arrData);
    }
  ], function (err, arrData) {
    callback(err, arrData);
  });
};

Base.apply(Category, 'category');

module.exports = Category;

