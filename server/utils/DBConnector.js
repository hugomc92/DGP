var config = require('../config/config.json');
var Sequelize = require("sequelize");

function DBConnector() {
	this.sequelize_M4E = undefined;

	this.host_M4E = config.db.host;
	this.port_M4E = config.db.port;
	this.database_M4E = config.db.database;
	this.username_M4E = config.db.username;
	this.password_M4E = config.db.password;
	this.driver_M4E = config.db.driver;

	this.initialize();

	this.testConnection();
}

DBConnector.prototype.initialize = function() {
	var self = this;

	self.sequelize_M4E = new Sequelize(self.database_M4E, self.username_M4E, self.password_M4E, {
		host: self.host_M4E,
		port: self.port_M4E,
		protocol: 'tcp',
		maxConcurrentQueries: 40,
		dialect: self.driver_M4E,
		//logging: console.log,         // Uncomment this line and comment next to log SQL Queries
		logging: false,
		define: { timestamps: false },
		query: { raw: true }
	});
};

DBConnector.prototype.connectM4E = function() {
	return this.sequelize_M4E;
};

DBConnector.prototype.testConnection = function() {
	var self = this;
	self.sequelize_M4E.authenticate()
		.then(function(err) {
		console.log('Connection has been established successfully with M4E.');
	})
	.catch(function (err) {
		console.log('Unable to connect to the database M4E:', err);
	});
};

DBConnector.prototype.closeConnection = function() {
	this.sequelize_M4E.close().then(function(err) {
		console.log('Connection closed to the database M4E.');
	})
	.close(function(err) {
		console.log('Unable to close to the database M4E', err);
	});
};

module.exports = new DBConnector();