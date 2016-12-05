var express = require('express');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Utils = require('../utils/Util');
var Localization = require('../models/Localization');
var ActivityLogController = require('./ActivityLogController');

// Constructor for LocalizationController
function LocalizationController(json) {
	this.renderJson = json;
	this.routerBackend = express.Router();
	this.initBackend();
}

// Method for initFrontend
LocalizationController.prototype.initFrontend = function() {
	var self = this;
};

// Method for initBackend
LocalizationController.prototype.initBackend = function () {
	var self = this;

	// Launch Localization section
	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/localizations/', 'SECTION': 'Localizaciones'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var localizations = Localization.build();

			localizations.retrievePagination(1,30).then(function(result) {
				self.renderJson.localizations = result;
				res.render('pages/backend/localization', self.renderJson);
				self.clearMessages();
			}, function(error) {
				self.renderJson.error = 'Se ha producido un error interno recuperando las localizaciones';
				res.redirect('/backend');
			});
		}
		else {
			res.redirect('/');
		}
	});

	// Create a new Localization
	self.routerBackend.route('/add').post(function(req, res) {
		self.renderJson.user = req.session.user;

		if (typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var description_localization = req.body.add_description_localization;
			var nfc_localization = req.body.add_nfc_localization;
			var qr_localization = req.body.add_qr_localization;
			var coordinates_localization = req.body.add_coordinates_localization;

			var localization = Localization.build();

			localization.add(
				description_localization,
				nfc_localization,
				qr_localization,
				coordinates_localization
			).then(function(result) {
				self.renderJson.msg = 'Localización creada correctamente';

				// Add the event to a new Activity Log
				var activityLogC = new ActivityLogController(self.renderJson);
				var ct = "Inserción";
				var desc = "Se ha insertado la localización " + req.body.add_description_localization;
				var date = new Date();
				var uid = self.renderJson.user.ID;
				activityLogC.addNewActivityLog(ct, desc, date, uid);

				res.redirect('/backend/localizations');
			}, function(error) {
				self.renderJson.error = 'Se ha producido un error interno';
				res.redirect('/backend/localizations');
			});
		}
		else {
			res.redirect('/');
		}
	});

	// Edit an existing Localization
	self.routerBackend.route('/edit').post(function(req, res) {
		self.renderJson.user = req.session.user;

		if (typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var localization = Localization.build();
			var id_localization = req.body.edit_id_localization;
			localization.description = req.body.edit_description_localization;
			localization.nfc = req.body.edit_nfc_localization;
			localization.qr = req.body.edit_qr_localization;
			localization.coordinates = req.body.edit_coordinates_localization;

			localization.updateById(id_localization).then(function(result) {
				self.renderJson.msg = 'Localización editada correctamente';

				// Add the event to a new Activity Log
				var activityLogC = new ActivityLogController(self.renderJson);
				var ct = "Edición";
				var desc = "Se ha editado la localización " + req.body.edit_description_localization;
				var date = new Date();
				var uid = self.renderJson.user.ID;
				activityLogC.addNewActivityLog(ct, desc, date, uid);

				res.redirect('/backend/localizations');
			}, function(error) {
				self.renderJson.error = 'Se ha producido un error interno';
				res.redirect('/backend/localizations');
			});
		}
		else {
			res.redirect('/');
		}
	});

	// Delete an existing Localization
	self.routerBackend.route('/delete').post(function(req, res) {
		self.renderJson.user = req.session.user;

		if (typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var id_localization = req.body.delete_id_localization;
			var delete_localization = req.body.delete_localization;

			if(delete_localization === 'yes') {
				var localization = Localization.build();

				localization.retrieveById(id_localization).then(function(result) {
					var deleted_localization = Localization.build();

					deleted_localization.removeById(id_localization).then(function(result) {
						self.renderJson.msg = 'Se ha eliminado la localización correctamente';

						// Add the event to a new Activity Log
						var activityLogC = new ActivityLogController(self.renderJson);
						var ct = "Borrado";
						var desc = "Se ha eliminado la localización con ID " + id_localization;
						var date = new Date();
						var uid = self.renderJson.user.ID;
						activityLogC.addNewActivityLog(ct, desc, date, uid);

						res.redirect('/backend/localizations');
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno borrando la localización';
						res.redirect('/backend/localizations');
					});
				}, function(err) {
					self.renderJson.error = 'Se ha producido un error interno';
					res.redirect('/backend/localizations');
				});
			}
			else {
				self.renderJson.msg = 'No se ha efectuado su acción';
				res.redirect('/backend/localizations');
			}
		}
		else {
			red.redirect('/');
		}
	});
};

// Get the Backend router
LocalizationController.prototype.getRouterBackend = function() {
	return this.routerBackend;
};

// Get the Frontend router
LocalizationController.prototype.getRouterFrontend = function() {
	return this.routerFrontend;
};

// Get a Localization by its ID
LocalizationController.prototype.getLocalizationById = function(id) {
	var localization = Localization.build();

	return localization.retrieveById(id);
};

// Get all the Localizations by their IDs
LocalizationController.prototype.getAllLocalizationWidthIds = function(listIds) {
	var localization = Localization.build();

	return localization.retrieveAllByListIds(listIds);
};

// Get all the Localizations
LocalizationController.prototype.getAllLocalizations = function() {
	var localization = Localization.build();

	return localization.retrieveAll();
};

// Clear all the messages
LocalizationController.prototype.clearMessages = function() {
	delete this.renderJson.msg;
	delete this.renderJson.error;
};

module.exports = LocalizationController;
