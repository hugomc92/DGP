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
};

ContentTypeService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = ContentTypeService;
