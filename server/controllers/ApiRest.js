var config = require("../config/config").api;

var express = require("express");
var cors = require("cors");

var UserService = require('../service/UserService');
var ContentTypeService = require('../service/ContentTypeService');
var ContentService = require('../service/ContentService');
var LocalizationService = require('../service/LocalizationService');
var ActivityLogService = require('../service/ActivityLogService');
var LangService = require('../service/LangService');
var GuidedVisitService = require('../service/GuidedVisitService');

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

	// Serve REST API resources
	this.router.use('/api', this.serviceRouter);

	// Serve static resources
	this.router.use('/static', express.static(__dirname + '/../public/static'));
}

// Validate the API Key to increase the security
ApiRest.prototype.validateApiKey = function() {
	var self = this;

};

// Define API Services
ApiRest.prototype.defineApiServices = function() {
	var self = this;

	this.serviceRouter.use('/content_type', new ContentTypeService().getRouter());
	this.serviceRouter.use('/content', new ContentService().getRouter());
	this.serviceRouter.use('/user', new UserService().getRouter());
	this.serviceRouter.use('/localization', new LocalizationService().getRouter());
	this.serviceRouter.use('/activity_log', new ActivityLogService().getRouter());
	this.serviceRouter.use('/lang', new LangService().getRouter());
	this.serviceRouter.use('/guided_visit', new GuidedVisitService().getRouter());
};

// Get Router of API Rest
ApiRest.prototype.getRouter = function() {
	return this.router;
};

module.exports = ApiRest;
