var express = require("express");

function IndexController(json) {
	this.routerBackend = express.Router();
	this.routerFrontend = express.Router();

	this.renderJson = json;

	this.initBackend();
	this.initFrontend();
}

IndexController.prototype.initFrontend = function() {
	var self = this;

	self.routerFrontend.route('/').get(function(req, res) {
		// At the moment, we dont have frontend so, when accesing web site, redirect automatially to login.
		res.redirect('/user/login/');
	});
};

IndexController.prototype.initBackend = function() {
	var self = this;
	
	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = { 'LINK': '/backend/', 'SECTION': 'Inicio' };
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			res.render('pages/backend/index', self.renderJson);
			self.clearMessages();
		}
		else {
			res.redirect('/');
		}
	});
};


IndexController.prototype.getRouterFrontend = function() {
	return this.routerFrontend;
};

IndexController.prototype.getRouterBackend = function() {
	return this.routerBackend;
};

// Delete all messages used after render
IndexController.prototype.clearMessages = function() {
	delete this.renderJson.msg;
	delete this.renderJson.error;
	delete this.renderJson.breadcrumb;
};

module.exports = IndexController;