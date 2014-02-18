/**
 * Module with different general purpose utilities
 */

var _ = require('lodash');

/**
 * Convert snake_case string into a camelCase string.
 */
exports.snakeToCamelCase = function (string) {
  return string.replace(/(_\w)/g, function (m) {
    return m[1].toUpperCase();
  });
};

/**
 * Rename recursively all snake_case properties of a given object to camelCase properties.
 */
exports.convertToCamelCase = function convertToCamelCase(obj) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      var propertyValue = obj[property];
      if (typeof obj[property] === 'object')
        convertToCamelCase(obj[property]);
      delete obj[property];
      obj[exports.snakeToCamelCase(property)] = propertyValue;
    }
  }
};
