var express = require('express');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload'});
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Utils = require('../utils/Util');
var Content = require('../models/Content');

// Constructor for ContentController
function ContentController(json, activityLogC) {
	this.renderJson = json;
	this.uploadpath = path.join(__dirname, '..', 'public', 'static', 'upload') + '/';
	this.uploadimgpath = path.join(__dirname, '..', 'public', 'static', 'img', 'contents') + '/';

	this.activityLogController = activityLogC;

	this.routerBackend = express.Router();
	this.initBackend();
}

// Method for initFrontend
ContentController.prototype.initFrontend = function() {
	var self = this;
};

// Method for initBackend
ContentController.prototype.initBackend = function () {
	var self = this;

	// Launch Content section
	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/contents/', 'SECTION': 'Contenido'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var content = Content.build();

			content.retrievePagination(1,30).then(function(success) {
				self.renderJson.contents = success;

				res.render('pages/backend/contents', self.renderJson);
				self.clearMessages();
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error interno recuperando los contenidos';
				res.redirect('/backend');
			});
		}
		else {
			res.redirect('/');
		}
	});

	self.routerBackend.route('/add').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/contents/', 'SECTION': 'Contenido'};

		self.renderJson.moreContent = {'LINK': '/backend/contents/add', 'SECTION': 'Añadir Contenido'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {

			res.render('pages/backend/content', self.renderJson);
			self.clearMessages();
		}
		else {
			res.redirect('/');
		}
	});
};

// Get the Backend router
ContentController.prototype.getRouterBackend = function() {
	return this.routerBackend;
};

// Get the Frontend router
ContentController.prototype.getRouterFrontend = function() {
	return this.routerFrontend;
};

// Get a Content Type by its ID
ContentController.prototype.getContentById = function(id) {
	var content = Content.build();

	return content.retrieveById(id);
};

// Get all the Content Types by their IDs
ContentController.prototype.getAllContentWidthIds = function(listIds) {
	var content = Content.build();

	return content.retrieveAllByListIds(listIds);
};

// Clear all the messages
ContentController.prototype.clearMessages = function() {
	delete this.renderJson.msg;
	delete this.renderJson.error;
	delete this.renderJson.moreContent;
};

module.exports = ContentController;
