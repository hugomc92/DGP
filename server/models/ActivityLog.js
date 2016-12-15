var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var ActivityLog = DBConnector.connectM4E().define('ACTIVITY_LOG', {
	ID: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
	ACTION_TYPE: {type: Sequelize.STRING(50), allowNull: false},
	DESCRIPTION: {type: Sequelize.STRING(300), allowNull: false},
	DATE: {type: Sequelize.DATE, allowNull: false},
	USER_ID: {type: Sequelize.INTEGER, allowNull: false}
},
{
	instanceMethods: {
		retrieveById: function(id) {
			return ActivityLog.findOne({where: {ID: id}});
		},
		retrieveAllByListIds: function(listIds) {
			return ActivityLog.findAll({where: {ID: {in: listIds}}});
		},
		retrievePagination: function(inicio, fin){
			return ActivityLog.findAll({order: 'ID DESC', offset: parseInt(inicio) - 1, limit: parseInt(fin) });
		},
		add: function(action_type, description, date, user_id) {
			return ActivityLog.create({
				ACTION_TYPE: action_type,
				DESCRIPTION: description,
				DATE: date,
				USER_ID: user_id
			});
		}
	},
	freezeTableName: true
});

module.exports = ActivityLog;