var express = require('express');
var moment = require('moment');

var Content = require('../models/Content');
var ContentInformation = require('../models/ContentInformation');
var User = require('../models/User');

// Constructor for ActivityLogService
function ContentService() {
	this.router = express.Router();
	this.initializeRouter();
}

ContentService.prototype.initializeRouter = function() {
	var self = this;

	self.router.route('/all/:start/:end').get(function(req, res) {

		var start = req.params.start;
		var end = req.params.end;

		var content = Content.build();

		content.retrievePagination(start, end).then(function (result) {
			if(result)
				res.json(result);
			else
				res.status(401).send("Content not found");
		}, function(err) {
			res.status(404).send("Content not found");
		});
	});

	self.router.route('/type/:type/:start/:end').get(function(req, res) {

		var type = req.params.type;
		var start = req.params.start;
		var end = req.params.end;

		var content = Content.build();

		content.retrievePaginationByType(type, start, end).then(function (result) {
			if(result)
				res.json(result);
			else
				res.status(401).send("Content not found");
		}, function(err) {
			res.status(404).send("Content not found");
		});
	});

	self.router.route('/add').post(function(req, res) {
		console.log('CONTENT ADD');

		email = req.query.email;
		user = User.build();

		var jsonResObj = {};

		if(typeof email !== 'undefined') {
			user.retrieveByEmail(email).then(function(result) {
				if(result.ADMIN) {
					var jsonObj = req.body;

					console.log(jsonObj);

					var dateIn;
					var dateOut;

					var resIn = jsonObj.CONTENT.DATE_IN.split('/');
					var dayIn = resIn[0];
					var monthIn = resIn[1];
					var yearIn = resIn[2];

					var resOut = jsonObj.CONTENT.DATE_OUT.split('/');
					var dayOut = resOut[0];
					var monthOut = resOut[1];
					var yearOut = resOut[2];

					if(jsonObj.CONTENT.DATE_IN !== '')
						dateIn = new Date(yearIn, monthIn-1, dayIn);
					
					if(jsonObj.CONTENT.DATE_OUT !== '')
						dateOut = new Date(yearOut, monthOut-1, dayOut);

					var content = Content.build();

					content.add(dateIn, dateOut, jsonObj.CONTENT.LOCATION, jsonObj.CONTENT.TYPE).then(function(success) {
						content.retrieveLast().then(function(success) {
							var lastContent = success;

							console.log("Last", lastContent);

							var contentInformation = ContentInformation.build();

							contentInformation.add(jsonObj.CONTENT_INFO.NAME, jsonObj.CONTENT_INFO.DESCRIPTION, jsonObj.CONTENT_INFO.BLIND_DESCRIPTION, lastContent.ID, jsonObj.CONTENT_INFO.LANG).then(function(success) {
								
								jsonResObj.ok = lastContent.ID;

								res.json(jsonResObj);
							}, function(err) {
								jsonResObj.ok = 'failed';

								res.json(jsonResObj);
							});
						}, function(err) {
							jsonResObj.ok = 'failed';

							res.json(jsonResObj);
						});
					}, function(err) {
						jsonResObj.ok = 'failed';

						res.json(jsonResObj);
					});
				}
				else {
					jsonResObj.ok = 'not_allowed';

					res.json(jsonResObj);
				}
			}, function(err) {
				jsonResObj.ok = 'failed';

				res.json(jsonResObj);
			});
		}
		else {
			jsonResObj.ok = 'not_allowed';

			res.json(jsonResObj);
		}
	});

	self.router.route('/edit').post(function(req, res) {
		console.log('CONTENT EDIT');

		email = req.query.email;
		user = User.build();

		var jsonResObj = {};

		if(typeof email !== 'undefined') {
			user.retrieveByEmail(email).then(function(result) {
				if(result.ADMIN) {
					var jsonObj = req.body;

					console.log(jsonObj);

					var dateIn;
					var dateOut;

					var resIn = jsonObj.CONTENT.DATE_IN.split('/');
					var dayIn = resIn[0];
					var monthIn = resIn[1];
					var yearIn = resIn[2];

					var resOut = jsonObj.CONTENT.DATE_OUT.split('/');
					var dayOut = resOut[0];
					var monthOut = resOut[1];
					var yearOut = resOut[2];

					if(jsonObj.CONTENT.DATE_IN !== '')
						dateIn = new Date(yearIn, monthIn-1, dayIn);
					
					if(jsonObj.CONTENT.DATE_OUT !== '')
						dateOut = new Date(yearOut, monthOut-1, dayOut);

					var content = Content.build();

					content.updateById(dateIn, dateOut, jsonObj.CONTENT.LOCATION, jsonObj.CONTENT.TYPE).then(function(success) {
						content.retrieveLast().then(function(success) {
							var lastContent = success;

							console.log("Last", lastContent);

							var contentInformation = ContentInformation.build();

							contentInformation.updateById(jsonObj.CONTENT_INFO.NAME, jsonObj.CONTENT_INFO.DESCRIPTION, jsonObj.CONTENT_INFO.BLIND_DESCRIPTION, lastContent.ID, jsonObj.CONTENT_INFO.LANG).then(function(success) {
								
								jsonResObj.ok = lastContent.ID;

								res.json(jsonResObj);
							}, function(err) {
								jsonResObj.ok = 'failed';

								res.json(jsonResObj);
							});
						}, function(err) {
							jsonResObj.ok = 'failed';

							res.json(jsonResObj);
						});
					}, function(err) {
						jsonResObj.ok = 'failed';

						res.json(jsonResObj);
					});
				}
				else {
					jsonResObj.ok = 'not_allowed';

					res.json(jsonResObj);
				}
			}, function(err) {
				jsonResObj.ok = 'failed';

				res.json(jsonResObj);
			});
		}
		else {
			jsonResObj.ok = 'not_allowed';

			res.json(jsonResObj);
		}
	});
};

ContentService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = ContentService;
