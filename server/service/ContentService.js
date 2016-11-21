var express = require("express");
var Content = require("../models/Content");

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
};

ContentService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = ContentService;
