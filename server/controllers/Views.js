var config = require('../config/config.json').http;
var express = require('express');
var session = require('express-session');

var IndexController = require('./IndexController');
var UserController = require('./UserController');
var ContentController = require('./ContentController');
var ContentTypeController = require('./ContentTypeController');
var LocalizationController = require('./LocalizationController');
var ActivityLogController = require('./ActivityLogController');
var LangController = require('./LangController');
var GuidedVisitController = require('./GuidedVisitController');

function Views(app) {
	this.expressContext = app;
	this.expressContext.set('views', __dirname + '/../public/templates');
	this.expressContext.set('view engine', 'ejs');

	this.routerBackend = express.Router();
	this.routerFrontend = express.Router();

	this.renderJson = {};

	this.initPages();
}

Views.prototype.initPages = function() {
	var self = this;

	// Initialize controllers
	var indexC = new IndexController(self.renderJson);
	var activityLogC = new ActivityLogController(self.renderJson);
	var userC = new UserController(self.renderJson, activityLogC);

	activityLogC.setUserController(userC);

	var contentTypeC = new ContentTypeController(self.renderJson);
	var localizationC = new LocalizationController(self.renderJson);
	var langC = new LangController(self.renderJson, activityLogC);
	var contentC = new ContentController(self.renderJson, activityLogC, contentTypeC, localizationC, langC);
	var guidedVisitC = new GuidedVisitController(self.renderJson, activityLogC);


	// -- BACKEND VIEWS --
	self.routerBackend.use(indexC.getRouterBackend());
	self.routerBackend.use('/users', userC.getRouterBackend());
	self.routerBackend.use('/contentTypes', contentTypeC.getRouterBackend());
	self.routerBackend.use('/localizations', localizationC.getRouterBackend());
	self.routerBackend.use('/activityLogs', activityLogC.getRouterBackend());
	self.routerBackend.use('/contents', contentC.getRouterBackend());
	self.routerBackend.use('/langs', langC.getRouterBackend());
	self.routerBackend.use('/guided_visits', guidedVisitC.getRouterBackend());

	// -- FRONTEND VIEWS --
	self.routerFrontend.use(indexC.getRouterFrontend());
	self.routerFrontend.use('/user', userC.getRouterFrontend());

	// Attach both Views to Express Context.
	self.expressContext.use('/backend', self.routerBackend);
	self.expressContext.use('/', self.routerFrontend);
};

module.exports = Views;
