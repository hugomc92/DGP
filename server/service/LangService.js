var express = require("express");

var Language = require("../models/Language");

function LangService() {
	this.router = express.Router();
	this.initializeRouter();
}

LangService.prototype.initializeRouter = function() {
	var self = this;

	self.router.route('/').get(function(req, res) {
		var lang = Language.build();

		lang.retrieveAll().then(function(success) {
			if(success)
				res.json(success);
			else
				res.status(401).send("Lang not found");
		}, function(err) {
			res.status(404).send("Lang not found");
		});
	});

	self.router.route('/id/:id').get(function(req, res) {
		var langId = req.params.id;

		var lang = Language.build();

		lang.retrieveById(langId).then(function(success) {
			if(success)
				res.json(success);
			else
				res.status(401).send("Lang not found");
		}, function(err) {
			res.status(404).send("Lang not found");
		});
	});
};

LangService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = LangService;