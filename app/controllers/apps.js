'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    App = mongoose.model('App');


/**
 * List all Apps
 */
exports.all = function (req, res) {
    App.find().sort('-title').exec(function (err, apps) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(apps);
        }
    });
};

/**
 * Create a new App
 */
exports.create = function(req, res) {
    var app = new App(req.body);

    app.save(function(err) {
        if (err) {
            if (err.name==='ValidationError') {
                return res.send(422, {
                    errors: err.errors,
                    app: app
                });
            }
        } else {
            res.status(201).json(app);
        }
    });
};