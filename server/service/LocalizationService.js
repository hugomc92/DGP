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

	self.router.route('/id/:localization_id').get(function(req, res) {
		var id_localization = req.params.localization_id;
		var localization = Localization.build();

		localization.retrieveById(id_localization).then(function(result) {
			if(result)
				res.json(result);
			else
				res.status(401).send("Localization not found");
		}, function(error) {
				res.send("No se ha podido completar su solicitud");
		});
	});
};

LocalizationService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = LocalizationService;
