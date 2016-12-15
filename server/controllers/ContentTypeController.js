var express = require('express');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload'});
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Utils = require('../utils/Util');
var ContentType = require('../models/ContentType');
var ActivityLogController = require('./ActivityLogController');

// Constructor for ContentTypeController
function ContentTypeController(json) {
	this.renderJson = json;
	this.uploadpath = path.join(__dirname, '..', 'public', 'static', 'upload') + '/';
	this.uploadimgpath = path.join(__dirname, '..', 'public', 'static', 'img', 'content_type_icons') + '/';

	this.routerBackend = express.Router();
	this.initBackend();
}

// Method for initFrontend
ContentTypeController.prototype.initFrontend = function() {
	var self = this;
};

// Method for initBackend
ContentTypeController.prototype.initBackend = function () {
	var self = this;

	// Launch Content Type section
	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/contentTypes/', 'SECTION': 'Tipos de contenido'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var contentTypes = ContentType.build();

			contentTypes.retrievePagination(1,30).then(function(result) {
				self.renderJson.contentTypes = result;
				res.render('pages/backend/content_type', self.renderJson);
				self.clearMessages();
			}, function(error) {
				self.renderJson.error = 'Se ha producido un error interno recuperando los tipos de contenido';
				res.redirect('/backend');
			});
		}
		else {
			res.redirect('/');
		}
	});

	// Create a new Content Type
	self.routerBackend.route('/add').post(upload.array('add_icon_content_type', 1), function(req, res) {
		self.renderJson.user = req.session.user;

		if (typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var name_content_type = req.body.add_name_content_type;
			var description_content_type = req.body.add_description_content_type;
			var icon_content_type = '/static/img/img_not_available.png';

			// Check if there're files to upload
			if (req.files.length > 0) {
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
				icon_content_type = '/static/img/content_type_icons/' + file;
			}

			var content_type = ContentType.build();

			content_type.add(
				name_content_type,
				description_content_type,
				icon_content_type
			).then(function(result) {
				self.renderJson.msg = 'Tipo de contenido creado correctamente';

				// Add the event to a new Activity Log
				var activityLogC = new ActivityLogController(self.renderJson);
				var ct = "Inserción";
				var desc = "Se ha insertado el tipo de contenido " + name_content_type;
				var date = new Date();
				var uid = self.renderJson.user.ID;
				activityLogC.addNewActivityLog(ct, desc, date, uid);

				res.redirect('/backend/contentTypes');
			}, function(error) {
				self.renderJson.error = 'Se ha producido un error interno';
				res.redirect('/backend/contentTypes');
			});
		}
		else {
			res.redirect('/');
		}
	});

	// Edit an existing Content Type
	self.routerBackend.route('/edit').post(upload.array('edit_icon_content_type', 1), function(req, res) {
		self.renderJson.user = req.session.user;

		if (typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var contentType = ContentType.build();
			var id_content_type = req.body.edit_id_content_type;
			contentType.name = req.body.edit_name_content_type;
			contentType.description = req.body.edit_description_content_type;
			contentType.icon = req.body.edit_previous_icon_content_type;

			// Check if there're files to upload
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
				} catch(e) { 			// File not found
					file += extension;
				}

				dst = self.uploadimgpath + file;

				var tmp = self.uploadpath+req.files[0].filename;

				fs.createReadStream(tmp).pipe(fs.createWriteStream(dst));

				// Delete created tmp file.
				fs.unlink(tmp, function(error) {
					if(error)
						console.log(error);
					else
						console.log('successfully deleted ' + tmp);
				});

				// Path to the file, to be sabed in DB
				contentType.icon = '/static/img/content_type_icons/' + file;
			}

			contentType.updateById(id_content_type).then(function(result) {
				self.renderJson.msg = 'Tipo de contenido editado correctamente';

				// Add the event to a new Activity Log
				var activityLogC = new ActivityLogController(self.renderJson);
				var ct = "Edición";
				var desc = "Se ha editado el tipo de contenido " + contentType.name;
				var date = new Date();
				var uid = self.renderJson.user.ID;
				activityLogC.addNewActivityLog(ct, desc, date, uid);

				res.redirect('/backend/contentTypes');
			}, function(error) {
				self.renderJson.error = 'Se ha producido un error interno';
				res.redirect('/backend/contentTypes');
			});
		}
		else {
			res.redirect('/');
		}
	});

	// Delete an existing Content Type
	self.routerBackend.route('/delete').post(function(req, res) {
		self.renderJson.user = req.session.user;

		if (typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var id_content_type = req.body.delete_id_content_type;
			var delete_content_type = req.body.delete_content_type;

			if(delete_content_type === 'yes') {
				var contentType = ContentType.build();

				// Get the content type to get the icon to delete
				contentType.retrieveById(id_content_type).then(function(result) {
					// Delete the icon
					if (result.ICON !== '/static/img/img_not_available.png') {
						var dst = path.join(__dirname, '..', 'public') + result.ICON;

						fs.unlink(dst, function(error) {
							if (error)
								console.log(error);
							else
								console.log('successfully deleted' + dst);
						});
					}

					var deleted_content_type = ContentType.build();

					deleted_content_type.removeById(id_content_type).then(function(result) {
						self.renderJson.msg = 'Se ha eliminado el tipo de contenido correctamente';

						// Add the event to a new Activity Log
						var activityLogC = new ActivityLogController(self.renderJson);
						var ct = "Edición";
						var desc = "Se ha eliminado el tipo de contenido con ID " + id_content_type;
						var date = new Date();
						var uid = self.renderJson.user.ID;
						activityLogC.addNewActivityLog(ct, desc, date, uid);

						res.redirect('/backend/contentTypes');
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno borrando el tipo de contenido';
						res.redirect('/backend/contentTypes');
					});
				}, function(err) {
					self.renderJson.error = 'Se ha producido un error interno';
					res.redirect('/backend/contentTypes');
				});
			}
			else {
				self.renderJson.msg = 'No se ha efectuado su acción';
				res.redirect('/backend/contentTypes');
			}
		}
		else {
			red.redirect('/');
		}
	});
};

// Get the Backend router
ContentTypeController.prototype.getRouterBackend = function() {
	return this.routerBackend;
};

// Get the Frontend router
ContentTypeController.prototype.getRouterFrontend = function() {
	return this.routerFrontend;
};

// Get a Content Type by its ID
ContentTypeController.prototype.getContentTypeById = function(id) {
	var contentType = ContentType.build();

	return contentType.retrieveById(id);
};

// Get all the Content Types by their IDs
ContentTypeController.prototype.getAllContentTypeWidthIds = function(listIds) {
	var contentType = ContentType.build();

	return contentType.retrieveAllByListIds(listIds);
};

// Get all the Content Types
ContentTypeController.prototype.getAllContentTypes = function() {
	var contentType = ContentType.build();

	return contentType.retrieveAll();
};

// Clear all the messages
ContentTypeController.prototype.clearMessages = function() {
	delete this.renderJson.msg;
	delete this.renderJson.error;
};

module.exports = ContentTypeController;