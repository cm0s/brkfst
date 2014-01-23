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

AppSchema.statics = {
  list: function (expand, callback) {
    var query = this.find();

    if (expand === 'true') {
      query.populate('categories');
    }

    query
      .sort('title')
      .exec(callback);
  },
  byCategory: function (categoryId, callback) {
    this.find({'categories': categoryId})
      .sort('title')
      .exec(callback);
  }
};

//Remove the categories field whenever a model is converted to JSON.
AppSchema.set('toJSON', {
  transform: function (origDoc, jsonObj, options) {
    delete jsonObj.categories;
    return jsonObj;
  }
});

mongoose.model('App', AppSchema);
