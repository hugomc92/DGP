var express = require('express');
var crypto = require('crypto');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload/'});
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Utils = require('../utils/Util');
var Language = require('../models/Language');

function LangController(json, activityLogC) {
	this.renderJson = json;

	this.uploadpath = path.join(__dirname, '..', 'public', 'static', 'upload') +'/';
	this.uploadimgpath = path.join(__dirname, '..', 'public', 'static', 'img', 'langs')+'/';

	this.routerBackend = express.Router();
	this.routerFrontend = express.Router();

	this.activityLogController = activityLogC;

	this.initBackend();
}

LangController.prototype.initFrontend = function() {
	var self = this;
};

LangController.prototype.initBackend = function() {
	var self = this;

	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = { 'LINK': '/backend/langs/', 'SECTION': 'Idiomas' };
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var langs = Language.build();

			langs.retrieveAll().then(function(success) {
				self.renderJson.langs = success;

				res.render('pages/backend/lang', self.renderJson);
				self.clearMessages();
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error interno recuperando los idiomas';
				res.redirect('/backend');
			});
		}
		else
			res.redirect('/');
	});

	self.routerBackend.route('/add').post(upload.array('add_flag_lang', 1), function(req, res) {
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var name = req.body.add_name_lang;
			var code = req.body.add_code_lang;
			var flag = '/static/img/img_not_available.png';

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
				flag = '/static/img/langs/' + file;
			}

			var lang = Language.build();

			console.log("name", name);
			console.log("flag", flag);
			console.log("code", code);

			lang.add(name, flag, code).then(function(success) {
				self.renderJson.msg = 'Idioma añadido correctamente';

				// Add the event to a new Activity Log
				var ct = "Inserción";
				var desc = "Se ha añadido el idioma " + name + " con código " + code;
				var date = new Date();
				var uid = self.renderJson.user.ID;
				self.activityLogController.addNewActivityLog(ct, desc, date, uid);

				res.redirect('/backend/langs');
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error interno';
				res.redirect('/backend/langs');
			});
		}
		else
			res.redirect('/');
	});

	self.routerBackend.route('/edit').post(upload.array('edit_photo_user', 1), function(req, res) {
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var user = Lang.build();

			var id_user = req.body.edit_id_user;

			user.email = req.body.edit_email_user;
			user.password = req.body.edit_password_user;
			user.name = req.body.edit_name_user;
			user.surname = req.body.edit_surname_user;
			user.photo = req.body.edit_photo_anterior_user;

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
				user.photo = '/static/img/langs/' + file;
			}

			user.updateById(id_user).then(function(result) {
				self.renderJson.msg = 'Se ha editado correctamente';

				// Add the event to a new Activity Log
				var ct = "Edición";
				var desc = "Se ha editado al usuario " + user.name + " " + user.surname;
				var date = new Date();
				var uid = self.renderJson.user.ID;
				self.activityLogController.addNewActivityLog(ct, desc, date, uid);

				res.redirect('/backend/langs');
			}, function(error) {
				self.renderJson.error = 'Se ha producido un error interno';
				res.redirect('/backend/langs');
			});
		}
		else
			res.redirect('/');
	});

	self.routerBackend.route('/delete').post(function(req, res) {
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var id_user = req.body.delete_id_user;
			var delete_user = req.body.delete_user;

			if(delete_user === 'yes') {
				var user = Lang.build();

				// Get the user to get the photo to delete
				user.retrieveById(id_user).then(function(result) {
					// delete the photo
					if(result.PHOTO !== '/static/img/img_not_available.png') {
						var dst = path.join(__dirname, '..', 'public') + result.PHOTO;

						fs.unlink(dst, function(error) {
							if(error)
								console.log(error);
							else
								console.log('successfully deleted ' + dst);
						});
					}

					var deleted_user = Lang.build();

					deleted_user.removeById(id_user).then(function(result) {
						self.renderJson.msg = 'Se ha eliminado correctamente';

						// Add the event to a new Activity Log
						var ct = "Borrado";
						var desc = "Se ha eliminado al usuario con ID " + id_user;
						var date = new Date();
						var uid = self.renderJson.user.ID;
						self.activityLogController.addNewActivityLog(ct, desc, date, uid);

						res.redirect('/backend/langs');
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno borrando al usuario';
						res.redirect('/backend/langs');
					});
				}, function(err) {
					self.renderJson.error = 'Se ha producido un error interno';
					res.redirect('/backend/langs');
				});
			}
			else {
				self.renderJson.msg = 'No se ha efectuado su acción';
				res.redirect('/backend/langs');
			}
		}
		else
			res.redirect('/');
	});
};

LangController.prototype.getRouterBackend = function() {
	return this.routerBackend;
};

LangController.prototype.getRouterFrontend = function() {
	return this.routerFrontend;
};

LangController.prototype.getLangById = function(id) {
	var lang = Language.build();

	return lang.retrieveById(id);
};

LangController.prototype.getAllLangWidthIds = function(listIds) {
	var lang = Language.build();

	return lang.retrieveAllByListIds(listIds);
};

LangController.prototype.clearMessages = function() {
	delete this.renderJson.msg;
	delete this.renderJson.error;
};

module.exports = LangController;