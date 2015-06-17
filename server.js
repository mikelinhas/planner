/**
 * Module dependencies
 */

//Express
var express = require('express');
var app = express();

// other Dependencies
var morgan = require('morgan');
var path = require('path');
var ejslocals = require('ejs-locals');
var mongo = require('mongodb');
var mongodb = require('./database/mongo');
var routes = require('./routes'); // Routes for our application


//Middleware (used to be bundled with Express 3.0)
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/client');
app.set('view engine', 'ejs');
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: 'uwotm8' }));
// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(express.static(path.join(__dirname, 'client')));

var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
    app.use(errorHandler());
}

// production only
if (env === 'production') {
    // TODO
}

/** 
 * Connect to Database and Start Server
 */

mongodb.init(function (err, db) {
	if (err) {
		console.log(err);
	} else {
		
		console.log("Connected to MongoDB! Yay!")
		
		// Routes
		routes(app,db);
		
		app.listen(app.get('port'), function() {
		    console.log('Express server listening on port ' + app.get('port'));
		});
	}	
});

		