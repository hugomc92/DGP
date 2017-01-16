// Get config from file
var config = require('./config/config.json').http;

var compression = require('compression');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var app = express();

app.use(bodyParser());
app.use(compression());
app.use(helmet());

// sesion of 30 min
var sessionTimeout = 30 * 60 * 1000;
app.use(session({
	secret: '}]QrgL{MWT8vE8F?t&?S',
	resave: false,
	saveUninitialized: true,
	duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
}));

var http = require('http').Server(app);

// Util to format dates
var moment = require('moment');

// Our own utils
var Utils = require('./utils/Util');
app.locals.moment = moment; // moment available inside any ejs file
app.locals.Utils = Utils;   // Utils available inside any ejs file

// API Rest
var ApiRest = require('./controllers/ApiRest');

// Views Controller
var Views = require('./controllers/Views');

// Initialize Server
function Server(port) {
	this.port = port;

	this.rest = new ApiRest();
	this.views = new Views(app);
}

Server.prototype.start = function() {
	var self = this;

	this.initializeAPIRest();
	this.initErrorHandlers();

	http.listen(self.port, function() {
		var now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
		console.log(now+' Server listening on *:'+self.port);
	});
};

Server.prototype.initializeAPIRest = function() {
	var self = this;
	
	app.use(self.rest.getRouter());
};


Server.prototype.initErrorHandlers = function() {
	app.use(function(req, res, next) {
		res.status(404).send('Not available page');
	});

	app.use(function(err, req, res, next) {
		console.error(err.stack);
		res.status(500).send('Sorry, an error\'d ocurred. Try again');
	});
};

// Ensure a correct shutdown of server
var gracefulShutdown = function() {
	http.close(function() {
		console.log('Closed out remaining connections.');

		process.exit();
	});

	setTimeout(function() {
		console.error('Could not close connections in time, forcefully shutting down');
		process.exit();
	}, 10*1000);
};

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

var server = new Server(config.port);

server.start();