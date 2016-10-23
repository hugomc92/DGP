var config = require("../config/config").api;

var express = require("express");
var cors = require("cors");

var UserService = require('../service/UserService');

function ApiRest() {
	this.publicTokenList = [];
	this.activePublicToken = '';
	this.timeout = 10 * 60 * 1000;

	this.opened_apis = ['user'];

	this.serviceRouter = express.Router();
	this.validateApiKey();
	this.defineApiServices();

	this.router = express.Router();
	this.router.use(cors());

	// Servir los recursos de la api rest
	this.router.use('/api', this.serviceRouter);

	// Servir los recursos estaticos - static
	this.router.use('/static', express.static(__dirname + '/../public/static'));
}

// Validate the API Key to increase the security
ApiRest.prototype.validateApiKey = function() {
	var self = this;
	
};

// Define API Services
ApiRest.prototype.defineApiServices = function() {
	var self = this;

	this.serviceRouter.use('/user', new UserService().getRouter());
};

// Get Router of API Rest
ApiRest.prototype.getRouter = function() {
	return this.router;
};

module.exports = ApiRest;