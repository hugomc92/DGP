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
function GuidedVisitController(json, activityLogC, localizationC) {
	this.renderJson = json;
	this.uploadpath = path.join(__dirname, '..', 'public', 'static', 'upload') + '/';
	this.uploadimgpath = path.join(__dirname, '..', 'public', 'static', 'img', 'guided_visits') + '/';

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

	self.routerBackend.route('/add_visit').post(upload.array('visit_image', 1), function(req, res) {

		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			// Check if there's files to upload
			if(req.files.length > 0) {
				var file = Utils.normalizeStr(req.files[0].originalname);
				var extension = '.'+file.substr(file.lastIndexOf('.')+1);

				file = file.split('.').splice(0,1).join('.');

				var dst = self.uploadimgpath + file + extension;

				// Check if the file exist. If there's an error it doesn't exist
				try {
					fs.accessSync(dst, fs.F_OK);

					file += Date.now();
					file += extension;
				} catch(e) {		// File not found
					file += extension;
				}

				dst = self.uploadimgpath + file;

				var tmp = self.uploadpath+req.files[0].filename;

				fs.createReadStream(tmp).pipe(fs.createWriteStream(dst));

				// Delete created tmp file
				fs.unlink(tmp, function(error) {
					if(error)
						console.log(error);
					else
						console.log('successfully deleted ' + tmp);
				});

				// Path to the file, to be sabed in DB
				var newImage = '/static/img/guided_visits/' + file;

				/*self.renderJson.error = 'Visita Guiada añadida con éxito';

				res.redirect('/backend/guided_visits/edit/' + visitId + '/');*/

			}
			else {
				self.renderJson.error = 'Error interno con la imagen enviada';

				res.redirect('/backend/guided_visits/add/');
			}
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