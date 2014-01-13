'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


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

mongoose.model('AppCategory', AppCategorySchema);
