var express = require("express");
var crypto = require("crypto");
var ContentType = require("../models/ContentType");

// Constructor for ContentTypeService
function ContentTypeService() {
	this.router = express.Router();
	this.initializeRouter();
}

ContentTypeService.prototype.initializeRouter = function() {
	var self = this;

	self.router.route('/id/:content_type_id').get(function(req, res) {

	});

	self.router.route('/id/:content_type_id').get(function(req, res) {
		var id_content_type = req.params.content_type_id;
		var contentType = ContentType.build();

		contentType.retrieveById(id_content_type).then(function(result) {
			if(result)
				res.json(result);
			else
				res.status(401).send("Content Type not found");
		}, function(error) {
				res.send("No se ha podido completar su solicitud");
		});
	});
};

ContentTypeService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = ContentTypeService;
