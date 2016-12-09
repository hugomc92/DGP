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
		retrieveByContentId: function(contentId) {
			return ContentInformation.findAll({where: {CONTENT_ID: contentId}});
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
				CONTENT_ID: this.contentId,
				LANG_ID: this.langId
			}, {where: {ID: id}});
		}
	},
	freezeTableName: true
});

module.exports = ContentInformation;