var express = require('express');
var moment = require('moment');

var Content = require('../models/Content');
var ContentInformation = require('../models/ContentInformation');
var ContentType = require('../models/ContentType');
var Language = require('../models/Language');
var Localization = require('../models/Localization');
var User = require('../models/User');
var Image = require('../models/Image');
var AltImage = require('../models/AltImage');
var Video = require('../models/Video');

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

				for(var i=0; i<contents.length; i++)
					contentIds.push(contents[i].ID);

				var lang = Language.build();

				lang.retrieveByCode(code).then(function(success) {
					if(success !== null) {
						var langId = success.ID;
						
						var contentInformation = ContentInformation.build();

						contentInformation.retrieveAllByContentIdsByLang(contentIds, langId).then(function(success) {
							var contentInfos = success;

							var contentType = ContentType.build();

							contentType.retrieveById(type).then(function(success) {
								var contentType = success;

								var image = Image.build();

								image.retrieveAllByContentIds(contentIds).then(function(success) {
									var images = success;
									
									var imageIds = [];

									for(var i=0; i<images.length; i++)
										imageIds.push(images[i].ID);

									var altImage = AltImage.build();

									altImage.retrieveAllByImageIdsByLangId(imageIds, langId).then(function(success) {
										var imagesAltText = success;
										
																		
										for(var i=0; i<contents.length; i++) {
											var contentInfo;
											var contentImages = [];
											var contentInfofound = false;

											for(var j=0; j<contentInfos.length && !contentInfofound; j++) {
												if(contentInfos[j].CONTENT_ID === contents[i].ID) {
													contentInfo = contentInfos[j];
													contentInfofound = true;
												}
											}

											for(var k=0; k<images.length; k++) {
												if(images[k].CONTENT_ID === contents[i].ID) {
													var altTextFound = false;

													for(var l=0; l<imagesAltText.length && !altTextFound; l++) {
														if(imagesAltText[l].IMAGE_ID === images[k].ID && imagesAltText[l].LANG_ID === langId) {
															contentImages.push({
																image: images[k],
																alt_text: imagesAltText[l].ALT_TEXT
															});

															altTextFound = true;
														}
													}
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
										res.status(404).send("Images Alt Texts not found");
									});
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

											var image = Image.build();

											image.retrieveAllByContentId(cont.ID).then(function(success) {
												var images = success;

												var imageIds = [];

												for(var i=0; i<images.length; i++)
													imageIds.push(images[i].ID);

												var altImage = AltImage.build();

												altImage.retrieveAllByImageIdsByLangId(imageIds, langId).then(function(success) {
													var altImages = success;

													var video = Video.build();

													video.retrieveAllByContentIdByLangId(contentId, langId).then(function(success) {
														var videos = success;

														var jsonResObj= {};

														jsonResObj.location = contLocation;
														jsonResObj.content = cont;
														jsonResObj.content_information = contInformation;
														jsonResObj.content_type = contType;
														jsonResObj.images = [];
														jsonResObj.videos = [];

														for(var i=0; i<images.length; i++) {
															var altImageFound = false;
															var altImage = '';

															for(var j=0; j<altImages.length && !altImageFound; j++) {
																if(altImages[j].IMAGE_ID === images[i].ID) {
																	jsonResObj.images.push( {
																		image: images[i],
																		alt_text: altImages[i].ALT_TEXT
																	});

																	altImageFound = true;
																}
															}

															for(var k=0; k<videos.length; k++) {
																jsonResObj.videos.push({ video: videos[k] });
															}
														}

														res.json(jsonResObj);
													}, function(err) {
														res.status(404).send("Videos not found");
													});
												}, function(err) {
													res.status(404).send("Images Alt Texts not found");
												});
											}, function(err){
												res.status(404).send("Images not found");
											});
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

								var	jsonResObj = {
									contents: []
								};

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

												var image = Image.build();

												image.retrieveAllByContentIds(contentIds).then(function(success) {
													var images = success;
													
													var imageIds = [];

													for(var i=0; i<images.length; i++)
														imageIds.push(images[i].ID);

													var altImage = AltImage.build();

													altImage.retrieveAllByImageIdsByLangId(imageIds, langId).then(function(success) {
														var imagesAltText = success;

														var video = Video.build();

														video.retrieveAllByContentIds(contentIds).then(function(success) {
															var videos = success;

															for(var i=0; i<contents.length; i++) {
																var contentInfo;
																var contentT;
																var contentTypeFound = false;
																var contentImages = [];
																var contentInfofound = false;
																var contentVideos = [];

																for(var j=0; j<contentInfos.length && !contentInfofound; j++) {
																	if(contentInfos[j].CONTENT_ID === contents[i].ID) {
																		contentInfo = contentInfos[j];
																		contentInfofound = true;
																	}
																}

																for(var m=0; m<contentTypes.length && !contentTypeFound; m++) {
																	if(contentTypes[m].ID === contents[i].CONTENT_TYPE_ID) {
																		contentT = contentTypes[m];
																		contentTypeFound = true;
																	}
																}

																for(var k=0; k<images.length; k++) {
																	if(images[k].CONTENT_ID === contents[i].ID) {
																		var altTextFound = false;

																		for(var l=0; l<imagesAltText.length && !altTextFound; l++) {
																			if(imagesAltText[l].IMAGE_ID === images[k].ID && imagesAltText[l].LANG_ID === langId) {
																				contentImages.push({
																					image: images[k],
																					alt_text: imagesAltText[l].ALT_TEXT
																				});

																				altTextFound = true;
																			}
																		}
																	}
																}

																for(var n=0; n<videos.length; n++) {
																	if(videos[n].CONTENT_ID === contents[i].ID && (videos[n].LANG_ID === langId || videos[n].LANG_ID === null)) {
																		contentVideos.push( {
																			video: videos[n]
																		});
																	}
																}

																jsonResObj.contents.push( {
																	content: contents[i],
																	content_information: contentInfo,
																	content_type: contentT,
																	images: contentImages,
																	videos: contentVideos
																});
															}

															res.json(jsonResObj);
														}, function(err) {
															res.status(404).send("Videos not found");
														});
													}, function(err) {
														res.status(404).send("Images Alt Texts not found");
													});
												}, function(err) {
													res.status(404).send("Images not found");
												});
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
								
								contentInformation.retrieveLast().then(function(success) {

									jsonResObj.ok = 'ok';
									jsonResObj.contentId = lastContent.ID;
									jsonResObj.contentInfoId = success.ID;

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

					content.dateIn = dateIn;
					content.dateOut = dateOut;
					content.locationId = jsonObj.CONTENT.LOCATION;
					content.contentTypeID = jsonObj.CONTENT.TYPE;

					var contentId = jsonObj.CONTENT_ID;

					content.updateById(contentId).then(function(success) {
						var contentInformation = ContentInformation.build();

						if(jsonObj.CONTENT_INFO_ID !== '') {

							contentInformation.name = jsonObj.CONTENT_INFO.NAME;
							contentInformation.description = jsonObj.CONTENT_INFO.DESCRIPTION;
							contentInformation.blindDescription = jsonObj.CONTENT_INFO.BLIND_DESCRIPTION;

							contentInformation.updateById(jsonObj.CONTENT_INFO_ID).then(function(success) {
								
								jsonResObj.ok = contentId;

								res.json(jsonResObj);
							}, function(err) {
								jsonResObj.ok = 'failed';

								res.json(jsonResObj);
							});
						}
						else {
							contentInformation.add(jsonObj.CONTENT_INFO.NAME, jsonObj.CONTENT_INFO.DESCRIPTION, jsonObj.CONTENT_INFO.BLIND_DESCRIPTION, contentId, jsonObj.CONTENT_INFO.LANG).then(function(success) {
								
								contentInformation.retrieveLast().then(function(success) {

									jsonResObj.ok = 'ok';
									jsonResObj.contentId = contentId;
									jsonResObj.contentInfoId = success.ID;

									res.json(jsonResObj);
								}, function(err) {
									jsonResObj.ok = 'failed';

									res.json(jsonResObj);
								});
							}, function(err) {
								jsonResObj.ok = 'failed';

								res.json(jsonResObj);
							});
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

	self.router.route('/alt_images/id/:id').get(function(req, res) {

		var imageId = req.params.id;

		var user = req.session.user;

		var jsonResObj = {};

		if(typeof user !== 'undefined' && user.ADMIN) {
			var altImage = AltImage.build();

			altImage.retrieveAllByImageId(imageId).then(function(success) {
				if(success.length > 0)
					jsonResObj.altTexts = success;
				else
					jsonResObj.altTexts = 'failed';

				res.json(jsonResObj);	
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

	self.router.route('/delete_image/:imageId').post(function(req, res) {
		
		var imageId = req.params.imageId;

		var user = req.session.user;

		var jsonResObj = {};

		if(typeof user !== 'undefined' && user.ADMIN) {
			var altImage = AltImage.build();

			altImage.removeByImageId(imageId).then(function(success) {
				var image = Image.build();

				image.removeById(imageId).then(function(success) {
					jsonResObj.ok = 'ok';

					res.json(jsonResObj);
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
	});

	self.router.route('/delete_video/:videoId').post(function(req, res) {

		var user = req.session.user;
		
		var videoId = req.params.videoId;

		var jsonResObj = {};

		if(typeof user !== 'undefined' && user.ADMIN) {
			var video = Video.build();

			video.removeById(videoId).then(function(success) {
				jsonResObj.ok = 'ok';

				res.json(jsonResObj);
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

	self.router.route('/video/:videoId').get(function(req, res) {
		var user = req.session.user;
		
		var videoId = req.params.videoId;

		var jsonResObj = {};

		if(typeof user !== 'undefined' && user.ADMIN) {
			var video = Video.build();

			video.retrieveById(videoId).then(function(success) {
				jsonResObj.video = success;

				res.json(jsonResObj);
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