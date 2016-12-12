var express = require('express');
var moment = require('moment');

var Content = require('../models/Content');
var ContentInformation = require('../models/ContentInformation');
var ContentType = require('../models/ContentType');
var Language = require('../models/Language');
var Localization = require('../models/Localization');
var Image = require('../models/Image');

// Constructor for ContentService
function ContentService() {
	this.router = express.Router();
	this.initializeRouter();
}

ContentService.prototype.initializeRouter = function() {
	var self = this;

	self.router.route('/all/:start/:end').get(function(req, res) {

		var start = req.params.start;
		var end = req.params.end;

		var content = Content.build();

		content.retrievePagination(start, end).then(function (result) {
			if(result)
				res.json(result);
			else
				res.status(401).send("Content not found");
		}, function(err) {
			res.status(404).send("Content not found");
		});
	});

	self.router.route('/type/:type/:langCode').get(function(req, res) {

		var type = req.params.type;
		var code = req.params.langCode;

		var content = Content.build();

		content.retrieveAllByType(type).then(function (result) {
			var contents = result;

			if(contents.length > 0) {
				jsonResObj = {
					contents: []
				};

				var contentIds = [];
				var contentTypesIds = [];

				for(var i=0; i<contents.length; i++) {
					contentIds.push(contents[i].ID);
					contentTypesIds.push(contents[i].CONTENT_TYPE_ID);
				}

				var lang = Language.build();

				lang.retrieveByCode(code).then(function(success) {
					if(success !== null) {
						var langId = success.ID;
						
						var contentInformation = ContentInformation.build();

						contentInformation.retrieveAllByContentIdsByLang(contentIds, langId).then(function(success) {
							var contentInfos = success;

							var contentType = ContentType.build();

							contentType.retrieveAllByListIds(contentTypesIds).then(function(success) {
								var contentTypes = success;

								var image = Image.build();

								image.retrieveAllByContentIds(contentIds).then(function(success) {
									var images = success;

									for(var i=0; i<contents.length; i++) {
										var contentInfo;
										var contenType;
										var contentImages = [];
										var contentInfofound = false;
										var contentTypefound = false;

										for(var j=0; j<contentInfos.length && !contentInfofound; j++) {
											if(contentInfos[j].CONTENT_ID === contents[i].ID) {
												contentInfo = contentInfos[j];
												contentInfofound = true;
											}
										}

										for(var k=0; k<contentTypes.length && !contentTypefound; k++) {
											if(contentTypes[k].ID === contents[i].CONTENT_TYPE_ID) {
												contentType = contentTypes[k];
												contentTypefound = true;
											}
										}

										for(var l=0; l<images.length; l++) {
											if(images[l].CONTENT_ID === contents[i].ID) {
												contentImages.push(images[l]);
											}
										}

										jsonResObj.contents.push( {
											content: contents[i],
											content_information: contentInfo,
											content_type: contentType,
											images: contentImages
										});
									}
									res.json(jsonResObj);
								}, function(err) {
									res.status(404).send("Images not found");
								});
							}, function(err) {
								res.status(404).send("Content Types not found");
							});
						}, function(err) {
							res.status(404).send("Content Informations not found");
						});
					}
					else
						res.status(401).send("Lang not found");
				}, function(err) {
					res.status(404).send("Language not found");
				});
			}
			else
				res.status(401).send("Content not found");
		}, function(err) {
			res.status(404).send("Contents not found");
		});
	});

	self.router.route('/id/:id/:langCode').get(function(req, res) {
		
		var contentId = req.params.id;
		var langCode = req.params.langCode;

		var lang = Language.build();

		lang.retrieveByCode(langCode).then(function(success) {
			if(success !== null) {
				var langId = success.ID;

				var content = Content.build();

				content.retrieveById(contentId).then(function(success) {
					if(success !== null) {
						var cont = success;
						
						var location = Localization.build();

						location.retrieveById(cont.LOCALIZATION_ID).then(function(success) {
							var contLocation = success;
							
							var contentInformation = ContentInformation.build();

							contentInformation.retrieveByContentIdByLangId(contentId, langId).then(function(success) {
								if(success !== null) {

									var contInformation = success;

									var contentType = ContentType.build();

									contentType.retrieveById(cont.CONTENT_TYPE_ID).then(function(success) {
										if(success !== null) {
											var contType = success;

											var jsonResObj= {};

											jsonResObj.localization = contLocation;
											jsonResObj.content = cont;
											jsonResObj.content_information = contInformation;
											jsonResObj.content_type = contType;

											res.json(jsonResObj);
										}
										else
											res.status(401).send("Content Type not found");
									}, function(err) {
										res.status(404).send("Content Type not found");
									});
								}
								else
									res.status(401).send("Content Information not found");
							}, function(err) {
								res.status(404).send("Content Information not found");
							});
						}, function(err) {
							res.status(401).send("Location not found");
						});
					}
					else
						res.status(401).send("Content not found");
				}, function(err) {
					res.status(401).send("Content not found");
				});
			}
			else
				res.status(401).send("Lang not found");
		}, function(err) {
			res.status(404).send("Language not found");
		});
	});
	
	self.router.route('/location/:code/:langCode').get(function(req, res) {
		
		var code = req.params.code;
		var langCode = req.params.langCode;

		var lang = Language.build();

		lang.retrieveByCode(langCode).then(function(success) {
			if(success !== null) {
				var langId = success.ID;

				var location = Localization.build();

				location.retrieve(code).then(function(success) {
					if(success !== null) {
						var locat= success;

						var content = Content.build();

						content.retrieveAllByLocationId(locat.ID).then(function(success) {
							if(success !== null && success.length > 0) {
								var contents = success;

								var contentIds = [];
								var contentTypeIds = [];

								for(var i=0; i<contents.length; i++) {
									contentIds.push(contents[i].ID);
									contentTypeIds.push(contents[i].CONTENT_TYPE_ID);
								}

								var contentInfo = ContentInformation.build();

								contentInfo.retrieveAllByContentIdsByLang(contentIds, langId).then(function(success) {
									if(success !== null && success.length > 0) {
										var contentInfos = success;

										var contentType = ContentType.build();

										contentType.retrieveAllByListIds(contentTypeIds).then(function(success) {
											if(success !== null && success.length > 0) {
												var contentTypes = success;

												var jsonResObj = {
													location: locat,
													contents: []
												};

												for(var i=0; i<contents.length; i++) {
													var contentInfo;
													var contentInfofound = false;
													var contentTypefound = false;

													for(var j=0; j<contentInfos.length && !contentInfofound; j++) {
														if(contentInfos[j].CONTENT_ID === contents[i].ID) {
															contentInfo = contentInfos[j];
															contentInfofound = true;
														}
													}

													for(var k=0; k<contentTypes.length && !contentTypefound; k++) {
														if(contentTypes[k].ID === contents[i].CONTENT_TYPE_ID) {
															jsonResObj.contents.push( {
																content: contents[i],
																content_information: contentInfo,
																content_type: contentTypes[k]
															});
															contentTypefound = true;
														}
													}
												}
												res.json(jsonResObj);
											}
											else
												res.status(401).send("Content Types not found");
										}, function(err) {
											res.status(404).send("Content Types not found");
										});
									}
									else
										res.status(401).send("Content Information not found");
								}, function(err) {
									res.status(404).send("Content Information not found");
								});
							}
							else
								res.status(401).send("Content not found");
						}, function(err) {
							res.status(404).send("Content not found");
						});
					}
					else
						res.status(401).send("Location not found");
				}, function(err) {
					res.status(404).send("Location not found");
				});
			}
			else
				res.status(401).send("Lang not found");
		}, function(err) {
			res.status(404).send("Language not found");
		});
	});

	self.router.route('/add').post(function(req, res) {
		console.log('CONTENT ADD');

		email = req.query.email;
		user = User.build();

		var jsonResObj = {};

		if(typeof email !== 'undefined') {
			user.retrieveByEmail(email).then(function(result) {
				if(result.ADMIN) {
					var jsonObj = req.body;

					var dateIn;
					var dateOut;

					var resIn = jsonObj.CONTENT.DATE_IN.split('/');
					var dayIn = resIn[0];
					var monthIn = resIn[1];
					var yearIn = resIn[2];

					var resOut = jsonObj.CONTENT.DATE_OUT.split('/');
					var dayOut = resOut[0];
					var monthOut = resOut[1];
					var yearOut = resOut[2];

					if(jsonObj.CONTENT.DATE_IN !== '')
						dateIn = new Date(yearIn, monthIn-1, dayIn);
					
					if(jsonObj.CONTENT.DATE_OUT !== '')
						dateOut = new Date(yearOut, monthOut-1, dayOut);

					var content = Content.build();

					content.add(dateIn, dateOut, jsonObj.CONTENT.LOCATION, jsonObj.CONTENT.TYPE).then(function(success) {
						content.retrieveLast().then(function(success) {
							var lastContent = success;

							var contentInformation = ContentInformation.build();

							contentInformation.add(jsonObj.CONTENT_INFO.NAME, jsonObj.CONTENT_INFO.DESCRIPTION, jsonObj.CONTENT_INFO.BLIND_DESCRIPTION, lastContent.ID, jsonObj.CONTENT_INFO.LANG).then(function(success) {
								
								jsonResObj.ok = lastContent.ID;

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
				}
				else {
					jsonResObj.ok = 'not_allowed';

					res.json(jsonResObj);
				}
			}, function(err) {
				jsonResObj.ok = 'failed';

				res.json(jsonResObj);
			});
		}
		else {
			jsonResObj.ok = 'not_allowed';

			res.json(jsonResObj);
		}
	});

	self.router.route('/edit').post(function(req, res) {
		console.log('CONTENT EDIT');

		email = req.query.email;
		user = User.build();

		var jsonResObj = {};

		if(typeof email !== 'undefined') {
			user.retrieveByEmail(email).then(function(result) {
				if(result.ADMIN) {
					var jsonObj = req.body;

					console.log(jsonObj);

					var dateIn;
					var dateOut;

					var resIn = jsonObj.CONTENT.DATE_IN.split('/');
					var dayIn = resIn[0];
					var monthIn = resIn[1];
					var yearIn = resIn[2];

					var resOut = jsonObj.CONTENT.DATE_OUT.split('/');
					var dayOut = resOut[0];
					var monthOut = resOut[1];
					var yearOut = resOut[2];

					if(jsonObj.CONTENT.DATE_IN !== '')
						dateIn = new Date(yearIn, monthIn-1, dayIn);
					
					if(jsonObj.CONTENT.DATE_OUT !== '')
						dateOut = new Date(yearOut, monthOut-1, dayOut);

					var content = Content.build();

					content.updateById(dateIn, dateOut, jsonObj.CONTENT.LOCATION, jsonObj.CONTENT.TYPE).then(function(success) {
						content.retrieveLast().then(function(success) {
							var lastContent = success;

							console.log("Last", lastContent);

							var contentInformation = ContentInformation.build();

							contentInformation.updateById(jsonObj.CONTENT_INFO.NAME, jsonObj.CONTENT_INFO.DESCRIPTION, jsonObj.CONTENT_INFO.BLIND_DESCRIPTION, lastContent.ID, jsonObj.CONTENT_INFO.LANG).then(function(success) {
								
								jsonResObj.ok = lastContent.ID;

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
				}
				else {
					jsonResObj.ok = 'not_allowed';

					res.json(jsonResObj);
				}
			}, function(err) {
				jsonResObj.ok = 'failed';

				res.json(jsonResObj);
			});
		}
		else {
			jsonResObj.ok = 'not_allowed';

			res.json(jsonResObj);
		}
	});
};

ContentService.prototype.getRouter = function() {
	return this.router;
};

module.exports = ContentService;