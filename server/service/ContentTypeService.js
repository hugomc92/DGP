var express = require("express");
var ContentType = require("../models/ContentType");

// Constructor for ContentTypeService
function ContentTypeService() {
	this.router = express.Router();
	this.initializeRouter();
}

ContentTypeService.prototype.initializeRouter = function() {
	var self = this;

	self.router.route('/').get(function(req, res) {
		var contentType = ContentType.build();

		contentType.retrieveAll().then(function(success) {
			if(success.length > 0) {
				var jsonResObj = {
					content_types: success
				};
				
				res.json(jsonResObj);
			}
			else
				res.status(401).send("Content Types empty");
		}, function(err) {
			res.send("No se ha podido completar su solicitud");
		});
	});

	self.router.route('/id/:id').get(function(req, res) {
		var contentTypeId = req.params.id;

		var contentType = ContentType.build();
		
		contentType.retrieveById(contentTypeId).then(function(result) {
			if(result) 
				res.json(result);
			else
				res.status(401).send("Content Type Not found");
		}, function(error) {
			res.status(404).send("Content Type Not found");
		});
	});
};

ContentTypeService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = ContentTypeService;
