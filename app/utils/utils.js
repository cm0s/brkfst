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

exports.camelToSnakeCase = function (string) {
  if (!(string === '' || string === void 0)) {
    return string.replace(/([A-Z])/g, function ($1) {
      if (string.charAt(0) === $1) {
        return $1.toLowerCase();
      }
      else {
        return '_' + $1.toLowerCase();
      }
    });
  }
};

/**
 * Rename recursively all snake_case properties of a given object to camelCase properties.
 * @return this function doesn't return any result the object passed in parameter is directly modified.
 */
exports.convertObjPropertiesToCamelCase = function convertObjPropertiesToCamelCase(obj) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      var propertyValue = obj[property];
      if (typeof obj[property] === 'object')
        convertObjPropertiesToCamelCase(obj[property]);
      delete obj[property];
      obj[exports.snakeToCamelCase(property)] = propertyValue;
    }
  }
};

/**
 * Rename recursively all snake_case properties of a given object to camelCase properties.
 * @return this function doesn't return any result the object passed in parameter is directly modified.
 */
exports.convertObjPropertiesToSnakeCase = function convertObjPropertiesToSnakeCase(obj) {
  for (var property in obj) {
    if (obj.hasOwnProperty(property)) {
      var propertyValue = obj[property];
      if (typeof obj[property] === 'object')
        convertObjPropertiesToSnakeCase(obj[property]);
      delete obj[property];
      obj[exports.camelToSnakeCase(property)] = propertyValue;
    }
  }
};
