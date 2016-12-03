var express = require('express');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Utils = require('../utils/Util');
var ActivityLog = require('../models/ActivityLog');

// Constructor for LocalizationController
function ActivityLogController(json) {
	this.renderJson = json;
	this.routerBackend = express.Router();
}

ActivityLogController.prototype.setUserController = function(userC) {

	this.userController = userC;

	this.initBackend();
};

// Method for initFrontend
ActivityLogController.prototype.initFrontend = function() {
	var self = this;
};

// Method for initBackend
ActivityLogController.prototype.initBackend = function () {
	var self = this;

	// Launch Activity Log section
	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/activityLogs/', 'SECTION': 'Historial de actividad'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var activityLogs = ActivityLog.build();

			activityLogs.retrievePagination(1,30).then(function(result) {
				var activities = result;
				self.renderJson.activityLogs = result;
				var activity_users = [];

				for(var i=0; i<result.length; i++)
					activity_users.push(result[i].USER_ID);

				self.userController.getAllUserWidthIds(activity_users).then(function (result) {
					for(var i=0; i<activities.length; i++) {
						for(var j=0; j<result.length; j++)
							if(result[j].ID === activities[i].USER_ID)
								self.renderJson.activityLogs[i].USER = result[j];
					}

					res.render('pages/backend/activity_log', self.renderJson);
					self.clearMessages();
				}, function(err) {

				});
			}, function(error) {
				console.log(error);
				self.renderJson.error = 'Se ha producido un error interno recuperando el historial de actividad';
				res.redirect('/backend');
			});
		}
		else {
			res.redirect('/');
		}
	});
};

// Add a new Activity Log
ActivityLogController.prototype.addNewActivityLog = function(action_type, description, date, user_id) {
	console.log("params:", action_type, description, date, user_id);
	
	var activityLog = ActivityLog.build();

	activityLog.add(action_type, description, date, user_id);
};

// Get the Backend router
ActivityLogController.prototype.getRouterBackend = function() {
	return this.routerBackend;
};

// Get the Frontend router
ActivityLogController.prototype.getRouterFrontend = function() {
	return this.routerFrontend;
};

// Get an Activity Log by its ID
ActivityLogController.prototype.getLocalizationById = function(id) {
	var activityLog = ActivityLog.build();

	return activityLog.retrieveById(id);
};

// Get all the Activty Logs by their IDs
ActivityLogController.prototype.getAllLocalizationWidthIds = function(listIds) {
	var activityLog = ActivityLog.build();

	return activityLog.retrieveAllByListIds(listIds);
};

// Clear all the messages
ActivityLogController.prototype.clearMessages = function() {
	delete this.renderJson.msg;
	delete this.renderJson.error;
};

module.exports = ActivityLogController;
