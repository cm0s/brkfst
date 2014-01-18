'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * App Schema
 */
var AppSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    url: String
  },
  categories: [
    {
      type: Schema.ObjectId,
      ref: 'AppCategory'
    }
  ]

});

mongoose.model('App', AppSchema);
