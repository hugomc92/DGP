var express = require('express');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload'});
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Utils = require('../utils/Util');
var GuidedVisit = require('../models/GuidedVisit');
var GuidedVisitInfo = require('../models/GuidedVisitInfo');

// Constructor for ContentTypeController
function GuidedVisitController(json, activityLogC) {
	this.renderJson = json;
	this.uploadpath = path.join(__dirname, '..', 'public', 'static', 'upload') + '/';
	this.uploadimgpath = path.join(__dirname, '..', 'public', 'static', 'img', 'guided_visits') + '/';

	this.activityLogController = activityLogC;

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

	// Launch Content Type section
	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/contentTypes/', 'SECTION': 'Visitas Guiadas'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			self.renderJson.visits = [];
			res.render('pages/backend/guided_visits', self.renderJson);
			self.clearMessages();
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
};

module.exports = GuidedVisitController;