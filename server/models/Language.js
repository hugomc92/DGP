var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var Language = DBConnector.connectM4E().define('LANGUAGE', {
	ID: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoincrement: true },
	NAME: { type: Sequelize.STRING(45), allowNull: false },
	FLAG: { type: Sequelize.STRING(100), allowNull: false },
	CODE: { type: Sequelize.STRING(10), allowNull: false },
},
{
	instanceMethods: {
		retrieveById: function(id) {
			return Language.findOne({where: {ID: id}});
		},
		retrieveAll: function() {
			return Language.findAll();
		},
		retrievePagination: function(inicio, fin){
			return Language.findAll({order: 'ID DESC', offset: parseInt(inicio) - 1, limit: parseInt(fin) });
		},
	},
	freezeTableName: true
});

module.exports = Language;