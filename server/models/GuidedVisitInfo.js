var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var GuidedVisitInfo = DBConnector.connectM4E().define('GUIDED_VISIT_INFO', {
	ID: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
	GUIDED_VISIT_ID: {type: Sequelize.INTEGER, allowNull: false },
	NAME: {type: Sequelize.STRING(100), allowNull: false },
	DESCRIPTION: {type: Sequelize.STRING(), allowNull: true },
	LANG_ID: {type: Sequelize.INTEGER, allowNull: false }

},
{
	instanceMethods: {
		retrieveById: function(id) {
			return GuidedVisitInfo.findOne({where: {ID: id}});
		},
		retrieveByVisitIdByLangId: function(visitId, langId) {
			return GuidedVisitInfo.findAll({ where: {GUIDED_VISIT_ID: visitId}, LANG_ID: langId});
		},
		retrieveByVisitIdListByLangId: function(visitIds, langId) {
			return GuidedVisitInfo.findAll( {where: {GUIDED_VISIT_ID: {in: visitIds}, LANG_ID: langId}});
		},
		add: function(visitId, name, description, langId) {
			return GuidedVisitInfo.create({
				GUIDED_VISIT_ID: visitId,
				NAME: name,
				DESCRIPTION: description,
				LANG_ID: langId
			});
		},
		updateById: function(id) {
			return GuidedVisitInfo.update({
				NAME: this.name,
				DESCRIPTION: this.description,
			}, {where: {ID: id}});
		}
	},
	freezeTableName: true
});

module.exports = GuidedVisitInfo;