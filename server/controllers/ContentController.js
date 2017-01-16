var express = require('express');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/static/upload'});
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var Utils = require('../utils/Util');
var Content = require('../models/Content');
var ContentInformation = require('../models/ContentInformation');
var Image = require('../models/Image');
var AltImage = require('../models/AltImage');
var Video = require('../models/Video');

// Constructor for ContentController
function ContentController(json, activityLogC, contentTypeC, localizationC, langC) {
	this.renderJson = json;
	
	this.uploadpath = path.join(__dirname, '..', 'public', 'static', 'upload') + '/';
	this.uploadimgpath = path.join(__dirname, '..', 'public', 'static', 'img', 'content_images') + '/';
	this.uploadvideopath = path.join(__dirname, '..', 'public', 'static', 'video', 'content_videos') + '/';
	this.uploadsubtitlepath = path.join(__dirname, '..', 'public', 'static', 'video', 'content_videos_subtitles') + '/';

	this.activityLogController = activityLogC;
	this.contentTypeController = contentTypeC;
	this.localizationController = localizationC;
	this.langController = langC;

	this.routerBackend = express.Router();
	this.initBackend();
}

// Method for initFrontend
ContentController.prototype.initFrontend = function() {
	var self = this;
};

// Method for initBackend
ContentController.prototype.initBackend = function() {
	var self = this;

	self.routerBackend.route('/').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/contents/', 'SECTION': 'Contenido'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var content = Content.build();

			content.retrievePagination(1,50).then(function(success) {
				self.renderJson.contents = success;

				var contentIds = [];
				var contentTypeIds = [];
				var locationIds = [];
				for(var i=0; i<success.length; i++) {
					contentIds.push(success[i].ID);
					contentTypeIds.push(success[i].CONTENT_TYPE_ID);
					locationIds.push(success[i].LOCALIZATION_ID);
				}

				self.contentTypeController.getAllContentTypeWidthIds(contentTypeIds).then(function(success) {
					self.renderJson.contentTypes = success;

					self.localizationController.getAllLocalizationWidthIds(locationIds).then(function(success) {
						self.renderJson.locations = success;

						var contentInformation = ContentInformation.build();

						contentInformation.retrieveAllByContentIds(contentIds).then(function(success) {
							self.renderJson.contentInformations = success;

							var langsIds = [];

							for(var i=0; i<success.length; i++)
								langsIds.push(success[i].LANG_ID);

							self.langController.getAllLangWidthIds(langsIds).then(function(success) {
								self.renderJson.langs = success;

								res.render('pages/backend/contents', self.renderJson);
								self.clearMessages();
							}, function(err) {
								self.renderJson.error = 'Se ha producido un error interno recuperando los idiomas2   de los contenidos';
								res.redirect('/backend/');
							});
						}, function(err) {
							self.renderJson.error = 'Se ha producido un error interno recuperando la información de los contenidos';
							res.redirect('/backend/');
						});
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno recuperando las localizaciones de los contenidos';
						res.redirect('/backend/');
					});
				}, function(err){
					self.renderJson.error = 'Se ha producido un error interno recuperando los tipos de los contenidos';
					res.redirect('/backend/');
				});
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error interno recuperando los contenidos';
				res.redirect('/backend/');
			});
		}
		else {
			res.redirect('/');
		}
	});

	self.routerBackend.route('/add').get(function(req, res) {
		self.renderJson.breadcrumb = {'LINK': '/backend/contents/', 'SECTION': 'Contenido'};

		self.renderJson.action = 'add';

		self.renderJson.moreContent = {'LINK': '/backend/contents/add', 'SECTION': 'Añadir Contenido'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			self.contentTypeController.getAllContentTypes().then(function(success) {
				self.renderJson.contentTypes = success;

				self.localizationController.getAllLocalizations().then(function(success) {
					self.renderJson.locations = success;

					res.render('pages/backend/content', self.renderJson);
					self.clearMessages();
				}, function(err) {
					self.renderJson.error = 'Se ha producido un error interno recuperando información';
				res.redirect('/backend/contents/');
				});
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error recuperando información';
				res.redirect('/backend/contents/');
			});
		}
		else {
			res.redirect('/');
		}
	});

	self.routerBackend.route('/edit/:contentId').get(function(req, res) {
		
		var contentId = req.params.contentId;

		self.renderJson.breadcrumb = {'LINK': '/backend/contents/', 'SECTION': 'Contenido'};

		self.renderJson.action = 'add';

		self.renderJson.moreContent = {'LINK': '/backend/contents/edit/' + contentId, 'SECTION': 'Editar Contenido'};
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			self.contentTypeController.getAllContentTypes().then(function(success) {
				self.renderJson.contentTypes = success;

				self.localizationController.getAllLocalizations().then(function(success) {
					self.renderJson.locations = success;

					var contentInformation = ContentInformation.build();

					contentInformation.retrieveByContentId(contentId).then(function(success) {
						self.renderJson.contentInformations = success;

						var langIds = [];
						for(var i=0; i<success.length; i++)
							langIds.push(success[i].LANG_ID);

						self.langController.getAllLangWidthIds(langIds).then(function(success) {
							self.renderJson.langs = success;

							var content = Content.build();

							content.retrieveById(contentId).then(function(success) {
								self.renderJson.cont = success;

								var image = Image.build();

								image.retrieveAllByContentId(contentId).then(function(success) {
									self.renderJson.images = success;

									var imageIds = [];

									for(var i=0; i<success.length; i++)
										imageIds.push(success[i].ID);

									var altImage = AltImage.build();

									altImage.retrieveAllByImageIds(imageIds).then(function(success) {
										self.renderJson.altTexts = success;

										var video = Video.build();

										video.retrieveAllByContentId(contentId).then(function(success) {
											self.renderJson.videos = success;
											
											res.render('pages/backend/content', self.renderJson);
											self.clearMessages();
										}, function(err) {
											self.renderJson.error = 'Se ha producido un error interno recuperando los videos';
											res.redirect('/backend/contents/');
										});
									}, function(err) {
										self.renderJson.error = 'Se ha producido un error interno recuperando la información de las imágenes';
										res.redirect('/backend/contents/');
									});									
								}, function(err) {
									self.renderJson.error = 'Se ha producido un error interno recuperando las imágenes';
									res.redirect('/backend/contents/');
								});
							}, function(err) {
								self.renderJson.error = 'Se ha producido un error interno recuperando el contenido';
								res.redirect('/backend/contents/');
							});
						}, function(err) {
							self.renderJson.error = 'Se ha producido un error interno recuperando los idiomas';
							res.redirect('/backend/contents/');
						});
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno recuperando la información';
						res.redirect('/backend/contents/');
					});
				}, function(err) {
					self.renderJson.error = 'Se ha producido un error interno recuperando información';
					res.redirect('/backend/contents/');
				});
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error recuperando información';
				res.redirect('/backend/contents/');
			});
		}
		else {
			res.redirect('/');
		}
	});

	self.routerBackend.route('/image/add/:contentId').post(upload.array('content_image', 1), function(req, res) {
		console.log('IMAGE ADD');

		var contentId = req.params.contentId;

		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {

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
				var newImage = '/static/img/content_images/' + file;

				var altTexts = [];

				for(var key in req.body) {
					if(key.indexOf('alt_text') > -1) {
						var langRes = key.split('_');
						var langId = langRes[langRes.length-1];

						console.log(key, req.body[key]);
						altTexts.push( {
							alt: req.body[key],
							lang: langId
						});
					}
				}

				var image = Image.build();

				image.add(newImage, contentId).then(function(success) {
					image.retrieveLast().then(function(success) {
						var img = success;

						var altImage = AltImage.build();

						altImage.addSome(altTexts, img.ID).then(function(success) {
							self.renderJson.msg = 'Imagen Añadida Correctamente';

							// Add the event to a new Activity Log
							var ct = "Inserción";
							var desc = "Se ha insertado una imagen al contenido con ID " + contentId;
							var date = new Date();
							var uid = self.renderJson.user.ID;
							self.activityLogController.addNewActivityLog(ct, desc, date, uid);

							res.redirect('/backend/contents/edit/' + contentId + '/');
						}, function(err) {
							self.renderJson.error = 'Error interno añadiendo los textos alternativos';

							res.redirect('/backend/contents/edit/' + contentId + '/');
						});
					}, function(err) {
						self.renderJson.error = 'Error interno recuperando información';

						res.redirect('/backend/contents/edit/' + contentId + '/');
					});
				}, function(err) {
					self.renderJson.error = 'Error interno añadiendo la imagen';

					res.redirect('/backend/contents/edit/' + contentId + '/');
				});
			}
			else {
				self.renderJson.error = 'Error mandando los archivos al servidor';

				res.redirect('/backend/contents/edit/' + contentId + '/');
			}		
		}
		else {
			self.renderJson.error = 'No tiene los permisos necesarios';

			res.redirect('/backend/contents/edit/' + contentId + '/');
		}
	});

	self.routerBackend.route('/image/edit/:imageId/:contentId').post(upload.array('content_image', 1), function(req, res) {

		var contentId = req.params.contentId;

		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var imageId = req.params.imageId;
			var newImage = '';

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
				newImage = '/static/img/content_images/' + file;
			}

			var altTexts = [];

			for(var key in req.body) {
				if(key.indexOf('alt_text') > -1) {
					var langRes = key.split('_');
					var langId = langRes[langRes.length-1];

					altTexts.push( {
						alt: req.body[key],
						lang: langId
					});
				}
			}

			var altImage = AltImage.build();

			altImage.updateSome(imageId, altTexts).then(function(success) {
				if(newImage !== '') {
					var image = Image.build();

					image.url = newImage;

					image.updateById(imageId).then(function(success) {
						self.renderJson.msg = 'La imagen ha sido editada correctamente';

						res.redirect('/backend/contents/edit/' + contentId + '/');
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno editando la imagen';

						res.redirect('/backend/contents/edit/' + contentId + '/');
					});
				}
				else {
					self.renderJson.msg = 'La imagen ha sido editada correctamente';

					res.redirect('/backend/contents/edit/' + contentId + '/');
				}
			}, function(err) {
				self.renderJson.error = 'Se ha producido un error interno';

				res.redirect('/backend/contents/edit/' + contentId + '/');
			});
		}
		else {
			self.renderJson.error = 'No tiene los permisos necesarios';

			res.redirect('/backend/contents/edit/' + contentId + '/');
		}
	});

	self.routerBackend.route('/video/add/:contentId').post(upload.array('content_video', 2), function(req, res) {

		var contentId = req.params.contentId;

		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {

			var newVideo = '';
			var newSubstitle = '';

			if(req.files.length > 0) {
				
				var file = Utils.normalizeStr(req.files[0].originalname);
				var extension = '.'+file.substr(file.lastIndexOf('.')+1);

				file = file.split('.').splice(0,1).join('.');

				var dst = self.uploadvideopath + file + extension;

				// Check if the file exist. If there's an error it doesn't exist
				try {
					fs.accessSync(dst, fs.F_OK);

					file += Date.now();
					file += extension;
				} catch(e) {		// File not found
					file += extension;
				}

				dst = self.uploadvideopath + file;

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
				newVideo = '/static/video/content_videos/' + file;
				
				var signLang = req.body.sign_lang;

				if(typeof signLang === 'undefined') {
					file = Utils.normalizeStr(req.files[1].originalname);
					extension = '.'+file.substr(file.lastIndexOf('.')+1);

					file = file.split('.').splice(0,1).join('.');

					dst = self.uploadsubtitlepath + file + extension;

					// Check if the file exist. If there's an error it doesn't exist
					try {
						fs.accessSync(dst, fs.F_OK);

						file += Date.now();
						file += extension;
					} catch(e) {		// File not found
						file += extension;
					}

					dst = self.uploadsubtitlepath + file;

					tmp = self.uploadpath+req.files[1].filename;

					fs.createReadStream(tmp).pipe(fs.createWriteStream(dst));

					// Delete created tmp file
					fs.unlink(tmp, function(error) {
						if(error)
							console.log(error);
						else
							console.log('successfully deleted ' + tmp);	
					});

					// Path to the file, to be sabed in DB
					newSubstitle = '/static/video/content_videos_subtitles/' + file;
				}

				var altText = {};

				if(typeof signLang !== 'undefined' && signLang === 'on') {
					altText.langId = null;
					altText.alt = null;
				}
				else {
					for(var key in req.body) {
						if(key.indexOf('alt_text') > -1) {
							var langRes = key.split('_');
							var langId = langRes[langRes.length-1];

							altText.alt = req.body[key];
							altText.lang = langId;
						}
					}
				}

				var video = Video.build();

				video.add(newVideo, newSubstitle, altText.alt, contentId, altText.lang).then(function(success) {
					self.renderJson.msg = 'Video Añadido Correctamente';

					// Add the event to a new Activity Log
					var ct = "Inserción";
					var desc = "Se ha insertado un video al contenido con ID " + contentId;
					var date = new Date();
					var uid = self.renderJson.user.ID;
					self.activityLogController.addNewActivityLog(ct, desc, date, uid);

					res.redirect('/backend/contents/edit/' + contentId + '/');
				}, function(err) {
					self.renderJson.error = 'Error añadiendo el video';

					res.redirect('/backend/contents/edit/' + contentId + '/');
				});
			}
			else {
				self.renderJson.error = 'Error mandando los archivos al servidor';

				res.redirect('/backend/contents/edit/' + contentId + '/');
			}
			
		}
		else 
			res.redirect('/');
	});

	self.routerBackend.route('/video/edit/:videoId/:contentId').post(upload.array('content_video', 2), function(req, res) {
		
		var videoId = req.params.videoId;
		var contentId = req.params.contentId;

		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			var newVideo = '';
			var newSubstitle = '';

			var signLang = req.body.sign_lang;

			console.log('body', req.body);
			console.log('files', req.files);

			if(req.files.length > 0) {
				var file = Utils.normalizeStr(req.files[0].originalname);
				var extension = '.'+file.substr(file.lastIndexOf('.')+1);

				file = file.split('.').splice(0,1).join('.');

				var dst = self.uploadvideopath + file + extension;

				// Check if the file exist. If there's an error it doesn't exist
				try {
					fs.accessSync(dst, fs.F_OK);

					file += Date.now();
					file += extension;
				} catch(e) {		// File not found
					file += extension;
				}

				dst = self.uploadvideopath + file;

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
				newVideo = '/static/video/content_videos/' + file;

				if(typeof signLang === 'undefined' && typeof(req.files[1]) !== 'undefined') {
					file = Utils.normalizeStr(req.files[1].originalname);
					extension = '.'+file.substr(file.lastIndexOf('.')+1);

					file = file.split('.').splice(0,1).join('.');

					dst = self.uploadsubtitlepath + file + extension;

					// Check if the file exist. If there's an error it doesn't exist
					try {
						fs.accessSync(dst, fs.F_OK);

						file += Date.now();
						file += extension;
					} catch(e) {		// File not found
						file += extension;
					}

					dst = self.uploadsubtitlepath + file;

					tmp = self.uploadpath+req.files[1].filename;

					fs.createReadStream(tmp).pipe(fs.createWriteStream(dst));

					// Delete created tmp file
					fs.unlink(tmp, function(error) {
						if(error)
							console.log(error);
						else
							console.log('successfully deleted ' + tmp);	
					});

					// Path to the file, to be sabed in DB
					newSubstitle = '/static/video/content_videos_subtitles/' + file;
				}
			}

			var video = Video.build();

			if(newVideo === '')
				video.url = null;
			else
				video.url = newVideo;

			if(newSubstitle === '')
				video.subtitle = null;
			else
				video.subtitle = newSubstitle;

			var altText = {};

			if(typeof signLang !== 'undefined' && signLang === 'on') {
				video.altText = null;
				video.langId = null;
			}
			else {
				for(var key in req.body) {
					if(key.indexOf('alt_text') > -1) {
						var langRes = key.split('_');
						var langId = langRes[langRes.length-1];

						video.altText = req.body[key];
						video.langId = langId;
					}
				}
			}

			video.updateById(videoId).then(function(success) {
				self.renderJson.msg = 'Se ha editado el video correctamente';

				res.redirect('/backend/contents/edit/' + contentId + '/');
			}, function(err) {
				self.renderJson.error = 'Error editando el video';

				res.redirect('/backend/contents/edit/' + contentId + '/');
			});
		}
		else
			res.redirect('/');
	});

	self.routerBackend.route('/delete').post(function(req, res) {
		self.renderJson.user = req.session.user;

		if(typeof self.renderJson.user !== 'undefined' && parseInt(self.renderJson.user.ADMIN)) {
			
			var contentId = req.body.delete_id_content;
			var delete_content = req.body.delete_content;

			if(delete_content === 'yes') {
				var image = Image.build();

				image.retrieveAllByContentId(contentId).then(function(success) {
					var images = success;

					var imageIds = [];
					for(var i=0; i<images.length; i++)
						imageIds.push(images[i].ID);

					var altImage = AltImage.build();

					altImage.removeByImagesIds(imageIds).then(function(success) {
						image.removeByContentId(contentId).then(function(success) {
							var contentInformation = ContentInformation.build();

							contentInformation.removeByContentId(contentId).then(function(success) {
								var content = Content.build();

								content.removeById(contentId).then(function(success) {
									self.renderJson.msg = 'Contenido borrado correctamente';

									// Add the event to a new Activity Log
									var ct = "Borrado";
									var desc = "Se ha eliminado el contenido con ID " + contentId;
									var date = new Date();
									var uid = self.renderJson.user.ID;
									self.activityLogController.addNewActivityLog(ct, desc, date, uid);
									
									res.redirect('/backend/contents');
								}, function(err) {
									self.renderJson.error = 'Se ha producido un error interno borrando el contenido';
									
									res.redirect('/backend/contents');
								});
							}, function(err) {
								self.renderJson.error = 'Se ha producido un error interno borrando la información del contenido';
									
								res.redirect('/backend/contents');
							});
						}, function(err) {
							self.renderJson.error = 'Se ha producido un error interno borrando las imágenes del contenido';
									
							res.redirect('/backend/contents');
						});
					}, function(err) {
						self.renderJson.error = 'Se ha producido un error interno borrando la información de las imágenes del contenido';
									
						res.redirect('/backend/contents');
					});
				}, function(err) {
					self.renderJson.error = 'Se ha producido un error interno';
									
					res.redirect('/backend/contents');
				});
			}
			else {
				self.renderJson.msg = 'No se ha efectuado su acción';

				res.redirect('/backend/contents');
			}
		}
		else
			res.redirect('/');
	});
};

// Get the Backend router
ContentController.prototype.getRouterBackend = function() {
	return this.routerBackend;
};

// Get the Frontend router
ContentController.prototype.getRouterFrontend = function() {
	return this.routerFrontend;
};

// Get a Content Type by its ID
ContentController.prototype.getContentById = function(id) {
	var content = Content.build();

	return content.retrieveById(id);
};

// Get all the Content Types by their IDs
ContentController.prototype.getAllContentWidthIds = function(listIds) {
	var content = Content.build();

	return content.retrieveAllByListIds(listIds);
};

// Clear all the messages
ContentController.prototype.clearMessages = function() {
	delete this.renderJson.msg;
	delete this.renderJson.error;
	delete this.renderJson.moreContent;
	
	delete this.renderJson.contents;
	delete this.renderJson.contentTypes;

	delete this.renderJson.locations;
	delete this.renderJson.contentInformations;
	delete this.renderJson.langs;

	delete this.renderJson.cont;
	delete this.renderJson.images;
	delete this.renderJson.videos;
};

module.exports = ContentController;