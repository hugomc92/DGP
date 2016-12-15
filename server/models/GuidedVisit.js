var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var GuidedVisit = DBConnector.connectM4E().define('GUIDED_VISIT', {
	ID: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
	PHOTO: {type: Sequelize.STRING(), allowNull: false},
},
{
	instanceMethods: {
		retrieveLast: function() {
			return GuidedVisit.findOne({order: 'ID DESC'});
		},
		retrieveAll: function() {
			return GuidedVisit.findAll();
		},
		retrieveById: function(id) {
			return GuidedVisit.findOne({where: {ID: id}});
		},
		retrieveAllByListIds: function(listIds) {
			return GuidedVisit.findAll({where: {ID: {in: listIds}}});
		},
		retrievePagination: function(inicio, fin){
			return GuidedVisit.findAll({order: 'ID DESC', offset: parseInt(inicio) - 1, limit: parseInt(fin) });
		},
		add: function(photo) {
			return GuidedVisit.create({
				PHOTO: photo
			});
		},
		updateById: function(id) {
			return GuidedVisit.update({
				PHOTO: this.photo
			}, {where: {ID: id}});
		}
	},
	freezeTableName: true
});

module.exports = GuidedVisit;