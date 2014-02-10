'use strict';

var async = require('async'),
  _ = require('lodash');

/**
 * takes nested mysql result array as a parameter,
 * converts it to a nested object
 *
 * author : Selman Kahya, 2013, https://github.com/Selmanh
 * @param {Array} rows
 * @param {Array} nestingOptions
 * @return {Object}
 */
exports.convertToNested = function (rows, nestingOptions) {
  async.waterfall([
    function (callback) {
      conn.query({
        sql: 'SELECT * FROM category JOIN app_category ON ' +
          'app_category.category_id = category.id JOIN app ON app.id = app_category.app_id',
        nestTables: true
      }, function (err, rows) {
        callback(err, rows);
      });
    },
    function (rows, callback) {
      //we're using each, because we have to filter out the category that is return on each row.
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


