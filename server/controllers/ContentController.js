var express = require('express');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload'});
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Utils = require('../utils/Util');
var Content = require('../models/Content');
var ContentInformation = require('../models/ContentInformation');
var Image = require('../models/Image');

// Constructor for ContentController
function ContentController(json, activityLogC, contentTypeC, localizationC, langC) {
	this.renderJson = json;
	this.uploadpath = path.join(__dirname, '..', 'public', 'static', 'upload') + '/';
	this.uploadimgpath = path.join(__dirname, '..', 'public', 'static', 'img', 'contents') + '/';

	this.activityLogController = activityLogC;
	this.contentTypeController = contentTypeC;
	this.localizationController = localizationC;
	this.langController = langC;

	this.routerBackend = express.Router();
	this.initBackend();
}

// Method for initFrontend
ContentController.prototype.initFrontend = function() {
	var self = this;
};

// Method for initBackend
ContentController.prototype.initBackend = function() {
	var self = this;

	// Launch Content section
	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/contents/', 'SECTION': 'Contenido'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var content = Content.build();

			content.retrievePagination(1,50).then(function(success) {
				self.renderJson.contents = success;

				var contentIds = [];
				var contentTypeIds = [];
				var locationIds = [];
				for(var i=0; i<success.length; i++) {
					contentIds.push(success[i].ID);
					contentTypeIds.push(success[i].CONTENT_TYPE_ID);
					locationIds.push(success[i].LOCALIZATION_ID);
				}

				self.contentTypeController.getAllContentTypeWidthIds(contentTypeIds).then(function(success) {
					self.renderJson.contentTypes = success;

					self.localizationController.getAllLocalizationWidthIds(locationIds).then(function(success) {
						self.renderJson.locations = success;

						var contentInformation = ContentInformation.build();

						contentInformation.retrieveAllByContentIds(contentIds).then(function(success) {
							self.renderJson.contentInformations = success;

							var langsIds = [];

							for(var i=0; i<success.length; i++)
								langsIds.push(success[i].LANG_ID);

							self.langController.getAllLangWidthIds(langsIds).then(function(success) {
								self.renderJson.langs = success;

								res.render('pages/backend/contents', self.renderJson);
								self.clearMessages();
							}, function(err) {
								self.renderJson.error = 'Se ha producido un error interno recuperando los idiomas2   de los contenidos';
								res.redirect('/backend/');
							});
						}, function(err) {
							self.renderJson.error = 'Se ha producido un error interno recuperando la información de los contenidos';
							res.redirect('/backend/');
						});
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno recuperando las localizaciones de los contenidos';
						res.redirect('/backend/');
					});
				}, function(err){
					self.renderJson.error = 'Se ha producido un error interno recuperando los tipos de los contenidos';
					res.redirect('/backend/');
				});
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error interno recuperando los contenidos';
				res.redirect('/backend/');
			});
		}
		else {
			res.redirect('/');
		}
	});

	self.routerBackend.route('/add').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/contents/', 'SECTION': 'Contenido'};

		self.renderJson.action = 'add';

		self.renderJson.moreContent = {'LINK': '/backend/contents/add', 'SECTION': 'Añadir Contenido'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			self.contentTypeController.getAllContentTypes().then(function(success) {
				self.renderJson.contentTypes = success;

				self.localizationController.getAllLocalizations().then(function(success) {
					self.renderJson.localizations = success;

					res.render('pages/backend/content', self.renderJson);
					self.clearMessages();
				}, function(err) {
					self.renderJson.error = 'Se ha producido un error interno recuperando información';
				res.redirect('/backend/contents/');
				});
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error recuperando información';
				res.redirect('/backend/contents/');
			});
		}
		else {
			res.redirect('/');
		}
	});

	self.routerBackend.route('/edit/:contentId').get(function(req, res) {
		
		var contentId = req.params.contentId;

		console.log('contentId', contentId);

		self.renderJson.breadcrumb = {'LINK': '/backend/contents/', 'SECTION': 'Contenido'};

		self.renderJson.action = 'add';

		self.renderJson.moreContent = {'LINK': '/backend/contents/edit/' + contentId, 'SECTION': 'Editar Contenido'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			self.contentTypeController.getAllContentTypes().then(function(success) {
				self.renderJson.contentTypes = success;

				self.localizationController.getAllLocalizations().then(function(success) {
					self.renderJson.locations = success;

					var contentInformation = ContentInformation.build();

					contentInformation.retrieveByContentId(contentId).then(function(success) {
						self.renderJson.contentInformations = success;

						var langIds = [];
						for(var i=0; i<success.length; i++)
							langIds.push(success[i].LANG_ID);

						self.langController.getAllLangWidthIds(langIds).then(function(success) {
							self.renderJson.langs = success;

							var content = Content.build();

							content.retrieveById(contentId).then(function(success) {
								self.renderJson.cont = success;

								var image = Image.build();

								image.retrieveAllByContentId(contentId).then(function(success) {
									self.renderJson.images = success;

									res.render('pages/backend/content', self.renderJson);
									self.clearMessages();
								}, function(err) {

								});
							}, function(err) {
								self.renderJson.error = 'Se ha producido un error interno recuperando las imágenes';
								res.redirect('/backend/contents/');
							});
						}, function(err) {
							self.renderJson.error = 'Se ha producido un error interno recuperando los idiomas';
							res.redirect('/backend/contents/');
						});
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno recuperando la información';
						res.redirect('/backend/contents/');
					});
				}, function(err) {
					self.renderJson.error = 'Se ha producido un error interno recuperando información';
					res.redirect('/backend/contents/');
				});
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error recuperando información';
				res.redirect('/backend/contents/');
			});
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
	
	delete this.renderJson.contents;
	delete this.renderJson.contentTypes;

	delete this.renderJson.locations;
	delete this.renderJson.contentInformations;
	delete this.renderJson.langs;

	delete this.renderJson.cont;
	delete this.renderJson.images;
};

module.exports = ContentController;