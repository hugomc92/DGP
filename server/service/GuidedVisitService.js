var express = require('express');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload'});
var fs = require('fs');
var path = require('path');

var Utils = require('../utils/Util');
var Language = require('../models/Language');
var GuidedVisit = require('../models/GuidedVisit');
var GuidedVisitInfo = require('../models/GuidedVisitInfo');
var LocalizationVisit = require('../models/LocalizationVisit');
var Localization = require('../models/Localization');

// Constructor for GuidedVisitService
function GuidedVisitService() {
	this.router = express.Router();
	
	this.uploadpath = path.join(__dirname, '..', 'public', 'static', 'upload') + '/';
	this.uploadimgpath = path.join(__dirname, '..', 'public', 'static', 'img', 'guided_visits') + '/';

	this.initializeRouter();
}

GuidedVisitService.prototype.initializeRouter = function() {
	var self = this;

	self.router.route('/:langCode').get(function(req, res) {

		var langCode = req.params.langCode;

		var guidedVisit = GuidedVisit.build();

		guidedVisit.retrieveAll().then(function(success) {
			if(success.length > 0) {

				var visits = success;

				var visitIds = [];
				for(var i=0; i<visits.length; i++)
					visitIds.push(visits[i].ID);

				var language = Language.build();

				language.retrieveByCode(langCode).then(function(success) {
					if(success) {
						var lang = success;

						var guidedVisitInfo = GuidedVisitInfo.build();

						guidedVisitInfo.retrieveByVisitIdListByLangId(visitIds, lang.ID).then(function(success) {
							var visitInfos = success;

							var jsonResObj = {
								visits : []
							};

							for(var i=0; i<visits.length; i++) {
								for(var j=0; j<visitInfos.length; j++) {
									if(visitInfos[j].GUIDED_VISIT_ID === visits[i].ID) {
										jsonResObj.visits.push({
											guided_visit: visits[i],
											guided_visit_info: visitInfos[j]
										});
									}
								}
							}

							res.json(jsonResObj);

						}, function(err) {
							res.status(404).send("Guided Visit Info not found");
						});
					}
					else
						res.status(401).send("Not Language Found");
				}, function(err) {
					res.status(404).send("Language not found");
				});
			}
			else
				res.status(401).send("Not Guided Visits Found");
		}, function(err) {
			res.status(404).send("Guided Visit not found");
		});
	});

	self.router.route('/id/:id/:langCode').get(function(req, res) {
		
		var visitId = req.params.id;
		var langCode = req.params.langCode;

		var visit = GuidedVisit.build();

		visit.retrieveById(visitId).then(function(success) {
			if(success) {
				var guidedVisit = success;

				var language = Language.build();

				language.retrieveByCode(langCode).then(function(success) {
					if(success) {
						var lang = success;

						var visitInfo = GuidedVisitInfo.build();

						visitInfo.retrieveByVisitIdByLangId(visitId, lang.ID).then(function(success) {
							if(success) {
								var guidedVisitInfo = success;

								var localizationVisit = LocalizationVisit.build();

								localizationVisit.retrieveAllByVisitId(visitId).then(function(success) {
									if(success) {
										var locationVisits = success;

										var locationIds = [];
										for(var i=0; i<locationVisits.length; i++)
											locationIds.push(locationVisits[i].LOC_ID);

										var localization = Localization.build();
										
										localization.retrieveAllByListIds(locationIds).then(function(success) {
											if(success.length > 0) {
												var locations = success;

												var jsonResObj = {
													visit: guidedVisit,
													visit_info: guidedVisitInfo,
													visit_locations: []
												};

												for(var i=0; i<locationVisits.length; i++) {
													for(var j=0; j<locations.length; j++) {
														if(locationVisits[i].LOC_ID === locations[j].ID) {
															jsonResObj.visit_locations.push( {
																location: locations[j],
																order: locationVisits[i].ORDER
															});
														}
													}
													
												}

												res.json(jsonResObj);
											}
											else
												res.status(401).send("Locations Not Found");
										}, function(err) {
											res.status(404).send("Locations Not Found");
										});
									}
									else
										res.status(404).send("Location Visit Not Found");
								}, function(err) {
									res.status(401).send("Location Visit Not Found");
								});
							}
							else
								res.status(401).send("Guided Visit Info Not Found");
						}, function(err) {
							res.status(401).send("Guided Visit Info Not Found");
						});
					}
					else {
						res.status(401).send("Language Not Found");
					}
				}, function(err) {
					res.status(404).send("Language Not Found");
				});
			}
			else {
				res.status(401).send("Guided Visit Not Found");
			}
		}, function(err) {
			res.status(404).send("Guided Visits Not Found");
		});
	});

	self.router.route('/add').post(upload.array('visit_image', 1), function(req, res) {

		console.log('add', req.body);

		user = req.session.user;

		var jsonResObj = {};

		if(typeof user !== 'undefined' && parseInt(user.ADMIN)) {
			// Check if there's files to upload
			if(req.files.length > 0) {
				var file = Utils.normalizeStr(req.files[0].originalname);
				var extension = '.'+file.substr(file.lastIndexOf('.')+1);

				file = file.split('.').splice(0,1).join('.');

				var dst = self.uploadimgpath + file + extension;

				// Check if the file exist. If there's an error it doesn't exist
				try {
					fs.accessSync(dst, fs.F_OK);

					file += Date.now();
					file += extension;
				} catch(e) {		// File not found
					file += extension;
				}

				dst = self.uploadimgpath + file;

				var tmp = self.uploadpath+req.files[0].filename;

				fs.createReadStream(tmp).pipe(fs.createWriteStream(dst));

				// Delete created tmp file
				fs.unlink(tmp, function(error) {
					if(error)
						console.log(error);
					else
						console.log('successfully deleted ' + tmp);
				});

				// Path to the file, to be sabed in DB
				var newImage = '/static/img/guided_visits/' + file;

				var visitLang = req.body.visit_lang;
				var visitName = req.body.visit_name;
				var visitImageAltText = req.body.visit_image_alt_text;
				var visitDescription = req.body.visit_description;
				var visitBlindDescription = req.body.visit_description;

				var locationOrder = [];

				for(var key in req.body) {
					if(key.indexOf('visit_location') > -1) {
						var keyRes = key.split('_');
						var ord = keyRes[keyRes.length-1];

						locationOrder.push( {
							locationId: req.body[key],
							order: ord
						});
					}
				}

				var guidedVisit = GuidedVisit.build();

				guidedVisit.add(newImage).then(function(success) {
					guidedVisit.retrieveLast().then(function(success) {
						var gv = success;

						var guidedVisitInfo = GuidedVisitInfo.build();

						guidedVisitInfo.add(gv.ID, visitName, visitDescription, visitBlindDescription, visitImageAltText, visitLang).then(function(success) {
							guidedVisitInfo.retrieveLast().then(function(success) {
								var gVI = success;

								var localizationVisit = LocalizationVisit.build();

								localizationVisit.addSome(locationOrder, gv.ID).then(function(success) {
									jsonResObj.ok = 'ok';
									jsonResObj.visitId = gv.ID;
									jsonResObj.visitInfoId = gVI.ID;

									res.json(jsonResObj);
								}, function(err) {
									jsonResObj.ok = 'failed';

									res.json(jsonResObj);
								});
							}, function(err) {
								jsonResObj.ok = 'failed';

								res.json(jsonResObj);
							});
						}, function(err) {
							jsonResObj.ok = 'failed';

							res.json(jsonResObj);
						});
					}, function(err) {
						jsonResObj.ok = 'failed';

						res.json(jsonResObj);
					});
				}, function(err) {
					jsonResObj.ok = 'failed';

					res.json(jsonResObj);
				});
			}
			else {
				jsonResObj.ok = 'failed';

				res.json(jsonResObj);
			}
		}
		else {
			jsonResObj.ok = 'not_allowed';

			res.json(jsonResObj);
		}
	});

	self.router.route('/edit').post(upload.array('visit_image', 1), function(req, res) {

		console.log('edit', req.body);

		user = req.session.user;

		var jsonResObj = {};

		if(typeof user !== 'undefined' && parseInt(user.ADMIN)) {
			var newImage = '';

			// Check if there's files to upload
			if(req.files.length > 0) {
				var file = Utils.normalizeStr(req.files[0].originalname);
				var extension = '.'+file.substr(file.lastIndexOf('.')+1);

				file = file.split('.').splice(0,1).join('.');

				var dst = self.uploadimgpath + file + extension;

				// Check if the file exist. If there's an error it doesn't exist
				try {
					fs.accessSync(dst, fs.F_OK);

					file += Date.now();
					file += extension;
				} catch(e) {		// File not found
					file += extension;
				}

				dst = self.uploadimgpath + file;

				var tmp = self.uploadpath+req.files[0].filename;

				fs.createReadStream(tmp).pipe(fs.createWriteStream(dst));

				// Delete created tmp file
				fs.unlink(tmp, function(error) {
					if(error)
						console.log(error);
					else
						console.log('successfully deleted ' + tmp);
				});

				// Path to the file, to be sabed in DB
				newImage = '/static/img/guided_visits/' + file;
			}

			var visitId = req.body.visit_id;
			var visitInfoId = req.body.info_id;
			var visitLang = req.body.visit_lang;
			var visitName = req.body.visit_name;
			var visitImageAltText = req.body.visit_image_alt_text;
			var visitDescription = req.body.visit_description;
			var visitBlindDescription = req.body.visit_description;

			var locationOrder = [];

			for(var key in req.body) {
				if(key.indexOf('visit_location') > -1) {
					var keyRes = key.split('_');
					var ord = keyRes[keyRes.length-1];

					locationOrder.push( {
						locationId: req.body[key],
						order: ord
					});
				}
			}

			var guidedVisitInfo = GuidedVisitInfo.build();

			if(visitInfoId === '') {
				guidedVisitInfo.add(visitId, visitName, visitDescription, visitBlindDescription, visitImageAltText, visitLang).then(function(success) {
					guidedVisitInfo.retrieveLast().then(function(success) {
						var gVI = success;

						var localizationVisit = LocalizationVisit.build();

						localizationVisit.updateSome(visitId, locationOrder).then(function(success) {
							if(newImage !== '') {
								var guidedVisit = GuidedVisit.build();

								guidedVisit.photo = newImage;

								guidedVisit.updateById(visitId).then(function(success) {
									jsonResObj.ok = 'ok';
									jsonResObj.visitId = visitId;
									jsonResObj.visitInfoId = gVI.ID;

									res.json(jsonResObj);
								}, function(err) {
									jsonResObj.ok = 'failed';

									res.json(jsonResObj);
								});
							}
							else {
								jsonResObj.ok = 'ok';
								jsonResObj.visitId = visitId;
								jsonResObj.visitInfoId = visitInfoId;

								res.json(jsonResObj);
							}
						}, function(err){
							jsonResObj.ok = 'failed';

							res.json(jsonResObj);
						});
					}, function(err){
						jsonResObj.ok = 'failed';

						res.json(jsonResObj);
					});
				}, function(err) {
					jsonResObj.ok = 'failed';

					res.json(jsonResObj);
				});
			}
			else {
				guidedVisitInfo.name = visitName;
				guidedVisitInfo.description = visitDescription;
				guidedVisitInfo.blindDescription = visitBlindDescription;
				guidedVisitInfo.photoAltText = visitImageAltText;

				guidedVisitInfo.updateById(visitInfoId).then(function(success) {
					var localizationVisit = LocalizationVisit.build();
							
					localizationVisit.updateSome(visitId, locationOrder).then(function(success) {
						if(newImage !== '') {
							var guidedVisit = GuidedVisit.build();

							guidedVisit.photo = newImage;

							guidedVisit.updateById(visitId).then(function(success) {
								jsonResObj.ok = 'ok';
								jsonResObj.visitId = visitId;
								jsonResObj.visitInfoId = visitInfoId;

								res.json(jsonResObj);
							}, function(err) {
								jsonResObj.ok = 'failed';

								res.json(jsonResObj);
							});
						}
						else {
							jsonResObj.ok = 'ok';
							jsonResObj.visitId = visitId;
							jsonResObj.visitInfoId = visitInfoId;

							res.json(jsonResObj);
						}
					}, function(err){
						jsonResObj.ok = 'failed';

						res.json(jsonResObj);
					});
				}, function(err) {
					jsonResObj.ok = 'failed';

					res.json(jsonResObj);
				});
			}
		}
		else {
			jsonResObj.ok = 'not_allowed';

			res.json(jsonResObj);
		}
	});
};

GuidedVisitService.prototype.getRouter = function() {
	var self = this;
	return self.router;
};

module.exports = GuidedVisitService;