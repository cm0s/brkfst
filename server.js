'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
  fs = require('fs'),
  https = require('https'),
  passport = require('passport');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//Set the node enviornment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Initializing system variables 
var config = require('./config/config'),
  mysql = require('mysql');

//Bootstrap db connection
//TODO connect mysql db here
//var db = mongoose.connect('mongodb://localhost/brkfst-dev');

//Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function (path) {
  fs.readdirSync(path).forEach(function (file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(models_path);

// Bootstrap passport config
require('./config/passport')(passport);

var app = express();

//express settings
require('./config/express')(app, passport);
//TODO pass the db variable
//require('./config/express')(app, passport, db);

//Bootstrap routes
require('./config/routes')(app, passport);

//Start the app by listening on <port>
var port = process.env.PORT || config.port;
var sslPort = process.env.SSL_PORT || config.sslPort;

var options = {
  key: fs.readFileSync('./config/ssl/private.key'),
  cert: fs.readFileSync('./config/ssl/certificate.crt')
};

https.createServer(options, app).listen(sslPort, function () {
  console.log('Express app started on port ' + sslPort);
});

app.listen(port, function () {
  console.log('Express app started on port ' + port);
});


//expose app so we can test it
module.exports = app;
