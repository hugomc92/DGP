var express = require("express");
var crypto = require("crypto");

var User = require("../models/User");

function UserService() {
	this.router = express.Router();
	this.initializeRouter();
}

UserService.prototype.initializeRouter = function() {
	var self = this;

	self.router.route('/id/:user_id').get(function(req, res) {
		var id_user = req.params.user_id;

		var user = User.build();
		
		user.retrieveById(id_user).then(function(result) {
			if(result) 
				res.json(result);
			else
				res.status(401).send("User not found");
		}, function(error) {
			res.status(404).send("User not found");
		});
	});
};

UserService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = UserService;