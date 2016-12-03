var express = require('express');
var crypto = require('crypto');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload/'});
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Utils = require('../utils/Util');
var User = require('../models/User');

function UserController(json, activityLogC) {
	this.renderJson = json;

	this.uploadpath = path.join(__dirname, '..', 'public', 'static', 'upload') +'/';
	this.uploadimgpath = path.join(__dirname, '..', 'public', 'static', 'img', 'users')+'/';

	this.routerBackend = express.Router();
	this.routerFrontend = express.Router();

	this.activityLogController = activityLogC;

	this.initFrontend();
	this.initBackend();
}

UserController.prototype.initFrontend = function() {
	var self = this;

	self.routerFrontend.route('/login').get(function(req, res) {
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN))
			res.redirect('/backend/');
		else if(typeof self.renderJson.user !== 'undefined')
			res.redirect('/');
		else {
			res.render('pages/backend/login', self.renderJson);
			self.clearMessages();
		}
	});

	self.routerFrontend.route('/login/authentication').post(function(req, res) {
		var email = req.body.email_user;
		var password = req.body.password_user;

		var user = User.build();

		user.retrieveByEmail(email).then(function(result) {
			if(result) {
				var shasum = crypto.createHash('sha1');
				shasum.update(password);
				hashed_password = shasum.digest('hex');

				// Correct Password
				if(hashed_password == result.PASSWORD) {
					self.renderJson.user = result;
					page = '/';

					// Start a new session width logged user
					req.session.user = self.renderJson.user;

					// Check if is Admin
					var isAdmin = parseInt(self.renderJson.user.ADMIN);

					if(isAdmin) {
						var now = moment(new Date()).format('HH:mm DD-MM-YYYY');
						console.log('- ' + now + ': Admin ' + result.EMAIL + ' logged in');
						page = '/backend/';
					}

					res.redirect(page);
				}
				else { 				// Wrong Password
					// Update Fail Login field in database
					user.fail_login = result.FAIL_LOGIN + 1;

					user.updateFailLogin(email).then(function(result) {
						self.renderJson.error = 'La contraseña no es correcta';
						res.redirect('/user/login/');
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno';
						res.redirect('/user/login/');
					});
				}
			}
			else {
				self.renderJson.error = 'No existe ese usuario';
				res.redirect('/user/login/');
			}
		}, function(err) {
			self.renderJson.error = 'Se ha producido un error interno recuperando al usuario';
			res.redirect('/user/login/');
		});
	});

	self.routerFrontend.route('/logout').get(function (req, res) {
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined') {
			// Destroy the session
			var now = moment(new Date()).format('HH:mm DD-MM-YYYY');
			console.log('- ' + now + ': Admin ' + self.renderJson.user.EMAIL + ' logged out');
			req.session.destroy();
		}

		res.redirect('/');
	});
};

UserController.prototype.initBackend = function() {
	var self = this;

	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = { 'LINK': '/backend/users/', 'SECTION': 'Usuarios' };
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var users = User.build();

			users.retrievePagination(1, 30).then(function(result) {
				self.renderJson.users = result;
				res.render('pages/backend/user', self.renderJson);
				self.clearMessages();
			}, function(error) {
				self.renderJson.error = 'Se ha producido un error interno recuperando los usuarios';
				res.redirect('/backend');
			});
		}
		else
			res.redirect('/');
	});

	self.routerBackend.route('/add').post(upload.array('add_photo_user', 1), function(req, res) {
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var email_user = req.body.add_email_user;
			var password_user = req.body.add_password_user;
			var name_user = req.body.add_name_user;
			var surname_user = req.body.add_surname_user;
			var admin_user = req.body.add_admin_user;
			var photo_user = '/static/img/img_not_available.png';

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
				photo_user = '/static/img/users/' + file;
			}

			var user = User.build();

			user.add(
				email_user,
				password_user,
				name_user,
				surname_user,
				photo_user,
				admin_user
			).then(function(result) {
				self.renderJson.msg = 'Usuario añadido correctamente';

				// Add the event to a new Activity Log
				var ct = "Inserción";
				var desc = "Se ha añadido al usuario " + name_user + " " + surname_user;
				var date = new Date();
				var uid = self.renderJson.user.ID;
				self.activityLogController.addNewActivityLog(ct, desc, date, uid);

				res.redirect('/backend/users');
			}, function(error) {
				self.renderJson.error = 'Se ha producido un error interno';
				res.redirect('/backend/users');
			});
		}
		else
			res.redirect('/');
	});

	self.routerBackend.route('/edit').post(upload.array('edit_photo_user', 1), function(req, res) {
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var user = User.build();

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
				user.photo = '/static/img/users/' + file;
			}

			user.updateById(id_user).then(function(result) {
				self.renderJson.msg = 'Se ha editado correctamente';

				// Add the event to a new Activity Log
				var ct = "Edición";
				var desc = "Se ha editado al usuario " + user.name + " " + user.surname;
				var date = new Date();
				var uid = self.renderJson.user.ID;
				self.activityLogController.addNewActivityLog(ct, desc, date, uid);

				res.redirect('/backend/users');
			}, function(error) {
				self.renderJson.error = 'Se ha producido un error interno';
				res.redirect('/backend/users');
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
				var user = User.build();

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

					var deleted_user = User.build();

					deleted_user.removeById(id_user).then(function(result) {
						self.renderJson.msg = 'Se ha eliminado correctamente';

						// Add the event to a new Activity Log
						var ct = "Borrado";
						var desc = "Se ha eliminado al usuario con ID " + id_user;
						var date = new Date();
						var uid = self.renderJson.user.ID;
						self.activityLogController.addNewActivityLog(ct, desc, date, uid);

						res.redirect('/backend/users');
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno borrando al usuario';
						res.redirect('/backend/users');
					});
				}, function(err) {
					self.renderJson.error = 'Se ha producido un error interno';
					res.redirect('/backend/users');
				});
			}
			else {
				self.renderJson.msg = 'No se ha efectuado su acción';
				res.redirect('/backend/users');
			}
		}
		else
			res.redirect('/');
	});
};

UserController.prototype.getRouterBackend = function() {
	return this.routerBackend;
};

UserController.prototype.getRouterFrontend = function() {
	return this.routerFrontend;
};

UserController.prototype.getUserById = function(id) {
	var user = User.build();

	return user.retrieveById(id);
};

UserController.prototype.getUserByEmail = function(email) {
	var user = User.build();

	return user.retrieveByEmail(email);
};

UserController.prototype.getAllUserWidthIds = function(listIds) {
	var user = User.build();

	return user.retrieveAllByListIds(listIds);
};

UserController.prototype.updateNameSurname = function(id, name, surname) {
	var user = User.build();

	user.retrieveById(id).then(function(success) {
		if(success) {
			user.email = success.EMAIL;
			user.password = success.PASSWORD;
			user.name = name;
			user.surname = surname;

			user.updateById(id);
		}
	});
};

UserController.prototype.clearMessages = function() {
	delete this.renderJson.msg;
	delete this.renderJson.error;
};

module.exports = UserController;
