var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var ContentInformation = DBConnector.connectM4E().define('CONTENT_INFORMATION', {
	ID: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
	NAME: {type: Sequelize.STRING(100), allowNull: false},
	DESCRIPTION: {type: Sequelize.STRING, allowNull: true},
	BLIND_DESCRIPTION: {type: Sequelize.STRING, allowNull: false},
	CONTENT_ID: {type: Sequelize.INTEGER, allowNull: false},
	LANG_ID: {type: Sequelize.INTEGER, allowNull: false}
},
{
	instanceMethods: {
		retrieveById: function(id) {
			return ContentInformation.findOne({where: {ID: id}});
		},
		retrieveLast: function() {
			return ContentInformation.findOne({order: 'ID DESC'});
		},
		retrieveByContentId: function(contentId) {
			return ContentInformation.findAll({where: {CONTENT_ID: contentId}});
		},
		retrieveByContentIdByLangId: function(contentId, langId) {
			return ContentInformation.findOne({ where: {CONTENT_ID: contentId, LANG_ID: langId}});
		},
		retrieveAllByContentIds: function(contentIds) {
			return ContentInformation.findAll({where: {CONTENT_ID: {in: contentIds}}});
		},
		retrieveAllByContentIdsByLang: function(contentIds, langId) {
			return ContentInformation.findAll({where: {LANG_ID: langId, CONTENT_ID: {in: contentIds}}});
		},
		add: function(name, description, blindDescription, contentId, langId) {
			return ContentInformation.create( {
				NAME: name,
				DESCRIPTION: description,
				BLIND_DESCRIPTION: blindDescription,
				CONTENT_ID: contentId,
				LANG_ID: langId
			});
		},
		updateById: function(id) {
			return ContentInformation.update( {
				NAME: this.name,
				DESCRIPTION: this.description,
				BLIND_DESCRIPTION: this.blindDescription,
			}, {where: {ID: id}});
		}
	},
	freezeTableName: true
});

module.exports = ContentInformation;