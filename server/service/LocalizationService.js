var express = require("express");
var crypto = require("crypto");
var Localization = require("../models/Localization");

// Constructor for LocalizationService
function LocalizationService() {
	this.router = express.Router();
	this.initializeRouter();
}

LocalizationService.prototype.initializeRouter = function() {
	var self = this;

	self.router.route('/all').get(function(req, res) {
		var localization = Localization.build();

		localization.retrieveAll().then(function(result) {
			if(result)
				res.json(result);
			else
				res.status(401).send("Localization not found");
		}, function(error) {
				res.send("No se ha podido completar su solicitud");
		});
	});

	self.router.route('/id/:id').get(function(req, res) {
		var locationId = req.params.id;

		var localization = Localization.build();
		
		localization.retrieveById(locationId).then(function(result) {
			if(result) 
				res.json(result);
			else
				res.status(401).send("Localization Not found");
		}, function(error) {
			res.status(404).send("Localization Not found");
		});
	});
};

LocalizationService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = LocalizationService;