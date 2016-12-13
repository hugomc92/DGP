var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var AltImage = DBConnector.connectM4E().define('ALT_IMAGE', {
	ID: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
	IMAGE_ID: {type: Sequelize.INTEGER, allowNull: false },
	LANG_ID: {type: Sequelize.INTEGER, allowNull: false },
	ALT_TEXT: {type: Sequelize.STRING, allowNull: false }
},
{
	instanceMethods: {
		retrieveLast: function() {
			return AltImage.findOne({order: 'ID DESC'});
		},
		retrieveAll: function() {
			return AltImage.findAll();
		},
		retrieveAllByLang: function(langId) {
			return AltImage.findAll({ where: {LANG_ID: langId }});
		},
		retrieveAllByImageId: function(imageId) {
			return AltImage.findAll({ where: {IMAGE_ID: imageId }});
		},
		retrieveAllByImageIdByLangId: function(imageId, langId) {
			return AltImage.findAll({ where: {IMAGE_ID: imageId, LANG_ID: langId}});
		},
		retrieveAllByImageIds: function(imageIds) {
			return AltImage.findAll({ where: {IMAGE_ID: {in: imageId}}});
		},
		retrieveAllByImageIdsByLangId: function(imageIds, langId) {
			return AltImage.findAll({ where: {IMAGE_ID: {in: imageId}, LANG_ID: langId}});
		},
		retrieveById: function(id) {
			return AltImage.findOne({where: {ID: id}});
		},
		retrieveAllByListIds: function(listIds) {
			return AltImage.findAll({where: {ID: {in: listIds}}});
		},
		retrievePagination: function(inicio, fin){
			return AltImage.findAll({order: 'ID ASC', offset: parseInt(inicio) - 1, limit: parseInt(fin) });
		},
		add: function(imageId, langId, altText) {
			return AltImage.create({
				IMAGE_ID: imageId,
				LANG_ID: langId,
				ALT_TEXT: altText
			});
		},
		addSome: function(altTexts, imageId) {
			
			var jsonBulk = [];

			for(var i=0; i<altTexts.length; i++) {
				jsonBulk.push({
					IMAGE_ID: imageId,
					LANG_ID: altTexts[i].lang,
					ALT_TEXT: altTexts[i].alt
				});
			}

			console.log('jsonBulk', jsonBulk);

			return AltImage.bulkCreate(jsonBulk);

		},
		updateById: function(altImageId) {
			return AltImage.update({
				ALT_TEXT: this.altText
			}, {where: {ID: altImageId}});
		},
		removeById: function(altImageId) {
			return AltImage.destroy({where: {ID: altImageId}});
		}
	},
	freezeTableName: true
});

module.exports = AltImage;