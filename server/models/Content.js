var crypto = require("crypto");
var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var Content = DBConnector.connectM4E().define('CONTENT', {
	ID: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoincrement: true},
	CREATION_DATE: {type: Sequelize.DATE, allowNull: false},
	DATE_IN: {type: Sequelize.DATE, allowNull: false},
	DATE_OUT: {type: Sequelize.DATE, allowNull: false},
	LOCALIZATION_ID: {type: Sequelize.INTEGER, allowNull: true},
	CONTENT_TYPE_ID: {type: Sequelize.INTEGER, allowNull: true}
},
{
	instanceMethods: {
		retrieveById: function(id) {
			return Content.findOne({where: {ID: id}});
		},
		retrieveAllByListIds: function(listIds) {
			return Content.findAll({where: {ID: {in: listIds}}});
		}
	},
	freezeTableName: true
});

module.exports = Content;
