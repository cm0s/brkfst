/**
 * Module with different general purpose utilities
 */

var _ = require('lodash');

/**
 * Populate path fields of query documents results.
 * Population = replace a field containing a path by a document.
 * @param query the query which is going to be executed
 * @param fields list of field names containing a path which is going to be populated
 */
exports.populateQuery = function (query, fieldNames) {
  _.forEach(fieldNames, function (fieldName) {
    query.populate(fieldName);
  });
  return query;
};
