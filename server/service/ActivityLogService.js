var express = require("express");
var ActivityLog = require("../models/ActivityLog");

// Constructor for ActivityLogService
function ActivityLogService() {
	this.router = express.Router();
	this.initializeRouter();
}

ActivityLogService.prototype.initializeRouter = function() {
	var self = this;

	self.router.route('/id/:activity_log_id').get(function(req, res) {
		var activity_log_id = req.params.activity_log_id;
		var activityLog = ActivityLog.build();

		activityLog.retrieveById(activity_log_id).then(function(result) {
			if(result)
				res.json(result);
			else
				res.status(401).send("Activity Log not found");
		}, function(error) {
				res.send("No se ha podido completar su solicitud");
		});
	});
};

ActivityLogService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = ActivityLogService;