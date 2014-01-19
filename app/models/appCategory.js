'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  _ = require('lodash'),
  Schema = mongoose.Schema,
  App = mongoose.model('App');



/**
 * AppCategory Schema
 */
var AppCategorySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  }
});

AppCategorySchema.statics = {
  list: function (expand, callback) {
    this.find()
      .lean()
      .sort('-title')
      .exec(callback);
  }
};

mongoose.model('AppCategory', AppCategorySchema);
