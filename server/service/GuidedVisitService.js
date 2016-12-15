var express = require('express');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload'});
var fs = require('fs');
var path = require('path');

var Utils = require('../utils/Util');
var GuidedVisit = require('../models/GuidedVisit');
var GuidedVisitInfo = require('../models/GuidedVisitInfo');

// Constructor for GuidedVisitService
function GuidedVisitService() {
	this.router = express.Router();
	
	this.uploadpath = path.join(__dirname, '..', 'public', 'static', 'upload') + '/';
	this.uploadimgpath = path.join(__dirname, '..', 'public', 'static', 'img', 'guided_visits') + '/';

	this.initializeRouter();
}

GuidedVisitService.prototype.initializeRouter = function() {
	var self = this;

	self.router.route('/add').post(upload.array('visit_image', 1), function(req, res) {

		console.log('add', req.body);

		user = req.session.user;

		var jsonResObj = {};

		if(typeof user !== 'undefined' && parseInt(user.ADMIN)) {
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

				jsonResObj.ok = 'ok';

				res.json(jsonResObj);
			}
			else {
				jsonResObj.ok = 'failed';

				res.json(jsonResObj);
			}
		}
		else {
			jsonResObj.ok = 'not_allowed';

			res.json(jsonResObj);
		}
	});

	self.router.route('/edit').post(upload.array('visit_image', 1), function(req, res) {

		console.log('edit', req.body);

		user = req.session.user;

		var jsonResObj = {};

		if(typeof user !== 'undefined' && parseInt(user.ADMIN)) {
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

				jsonResObj.ok = 'ok';

				res.json(jsonResObj);
			}
			else {
				jsonResObj.ok = 'failed';

				res.json(jsonResObj);
			}
		}
		else {
			jsonResObj.ok = 'not_allowed';

			res.json(jsonResObj);
		}
	});
};

GuidedVisitService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = GuidedVisitService;