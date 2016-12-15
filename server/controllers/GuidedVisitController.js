var express = require('express');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload'});
var fs = require('fs');
var path = require('path');

var Utils = require('../utils/Util');
var GuidedVisit = require('../models/GuidedVisit');
var GuidedVisitInfo = require('../models/GuidedVisitInfo');

// Constructor for ContentTypeController
function GuidedVisitController(json, activityLogC, localizationC) {
	this.renderJson = json;

	this.activityLogController = activityLogC;
	this.localizationController = localizationC;

	this.routerBackend = express.Router();
	this.initBackend();
}

// Method for initFrontend
GuidedVisitController.prototype.initFrontend = function() {
	var self = this;
};

// Method for initBackend
GuidedVisitController.prototype.initBackend = function () {
	var self = this;

	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/contentTypes/', 'SECTION': 'Visitas Guiadas'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			
			res.render('pages/backend/guided_visits', self.renderJson);
			self.clearMessages();
		}
		else {
			res.redirect('/');
		}
	});

	self.routerBackend.route('/add').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/guided_visits/', 'SECTION': 'Visitas Guiadas'};

		self.renderJson.moreContent = {'LINK': '/backend/guided_visits/add/', 'SECTION': 'Añadir Visita'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
		
			self.localizationController.getAllLocalizations().then(function(success) {
				self.renderJson.locations = success;

				res.render('pages/backend/guided_visit', self.renderJson);
				self.clearMessages();
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error interno';

				res.redirect('/backend/guided_visits/');
			});
		}
		else {
			res.redirect('/');
		}
	});
};

// Get the Backend router
GuidedVisitController.prototype.getRouterBackend = function() {
	return this.routerBackend;
};

// Get the Frontend router
GuidedVisitController.prototype.getRouterFrontend = function() {
	return this.routerFrontend;
};

// Clear all the messages
GuidedVisitController.prototype.clearMessages = function() {
	delete this.renderJson.msg;
	delete this.renderJson.error;
	delete this.renderJson.moreContent;
};

module.exports = GuidedVisitController;