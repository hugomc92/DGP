var express = require('express');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload'});
var fs = require('fs');
var path = require('path');

var Utils = require('../utils/Util');
var Language = require('../models/Language');
var GuidedVisit = require('../models/GuidedVisit');
var GuidedVisitInfo = require('../models/GuidedVisitInfo');
var LocalizationVisit = require('../models/LocalizationVisit');
var Localization = require('../models/Localization');

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
		self.renderJson.breadcrumb = {'LINK': '/backend/guided_visits/', 'SECTION': 'Visitas Guiadas'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var guidedVisit = GuidedVisit.build();

			guidedVisit.retrieveAll().then(function(success) {
				var visits = success;

				var visitIds = [];
				for(var i=0; i<visits.length; i++)
					visitIds.push(visits[i].ID);

				var guidedVisitInfo = GuidedVisitInfo.build();

				guidedVisitInfo.retrieveByVisitIdList(visitIds).then(function(success) {
					var visitInfos = success;

					var langIds = [];
					for(var i=0; i<visitInfos.length; i++)
						langIds.push(visitInfos[i].LANG_ID);

					var language = Language.build();

					language.retrieveAllByListIds(langIds).then(function(success) {
						var langs = success;

						self.renderJson.visits = visits;
						self.renderJson.visitInfos = visitInfos;
						self.renderJson.langs = langs;

						res.render('pages/backend/guided_visits', self.renderJson);
						self.clearMessages();
					}, function(err) {
						self.renderJson.error = 'Error interno recuperando los idiomas de las visitas';

						res.redirect('/backend/');
					});
				}, function(err) {
					self.renderJson.error = 'Error interno recuperando la información de las visitas';

					res.redirect('/backend/');
				});
				
			}, function(err) {
				self.renderJson.error = 'Error interno recuperando las visitas';

				res.redirect('/backend/');
			});
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

	self.routerBackend.route('/edit/:id').get(function(req, res) {

		var visitId = req.params.id;

		self.renderJson.breadcrumb = {'LINK': '/backend/guided_visits/', 'SECTION': 'Visitas Guiadas'};

		self.renderJson.moreContent = {'LINK': '/backend/guided_visits/edit/' + visitId + '/', 'SECTION': 'Editar Visita'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
		
			var guidedVisit = GuidedVisit.build();

			guidedVisit.retrieveById(visitId).then(function(success) {
				self.renderJson.visit = success;

				var guidedVisitInfo = GuidedVisitInfo.build();

				guidedVisitInfo.retrieveByVisitId(visitId).then(function(success) {
					self.renderJson.visitInfos = success;

					var langIds = [];
					for(var i=0; i<success.length; i++)
						langIds.push(success[i].LANG_ID);

					var language = Language.build();

					language.retrieveAllByListIds(langIds).then(function(success) {
						self.renderJson.langs = success;

						self.localizationController.getAllLocalizations().then(function(success) {
							self.renderJson.locations = success;

							var localizationVisit = LocalizationVisit.build();

							localizationVisit.retrieveAllByVisitId(visitId).then(function(success) {
								self.renderJson.locationsVisit = success;
								
								res.render('pages/backend/guided_visit', self.renderJson);
								self.clearMessages();
							}, function(err) {

							});
						}, function(err) {
							self.renderJson.error = 'Se ha producido un error interno';

							res.redirect('/backend/guided_visits/');
						});
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno recuperando los idiomas de la visita';

						res.redirect('/backend/guided_visits/');
					});
				}, function(err) {
					self.renderJson.error = 'Se ha producido un error interno recuperando la información de la visita';

					res.redirect('/backend/guided_visits/');
				});
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error interno recuperando la visita';

				res.redirect('/backend/guided_visits/');
			});
		}
		else
			res.redirect('/');
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

	delete this.renderJson.visits;
	delete this.renderJson.visitsInfos;
	delete this.renderJson.langs;

	delete this.renderJson.locations;
	delete this.renderJson.visit;
};

module.exports = GuidedVisitController;