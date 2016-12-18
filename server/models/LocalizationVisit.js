var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var LocalizationVisit = DBConnector.connectM4E().define('LOCALIZATION_VISIT', {
	VISIT_ID: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
	ORDER: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
	LOC_ID: { type: Sequelize.INTEGER, allowNull: false },
},
{
	instanceMethods: {
		retrieveAll: function() {
			return LocalizationVisit.findAll();
		},
		retrieveAllByVisitId: function(visitId) {
			return LocalizationVisit.findAll({where: {VISIT_ID: visitId}});
		},
		add: function(locId, visitId, order) {
			return LocalizationVisit.create( {
				VISIT_ID: visitId,
				ORDER: order,
				LOC_ID: locId,
			});
		},
		addSome: function(list, visitId) {
			var jsonBulk = [];

			for(var i=0; i<list.length; i++) {
				jsonBulk.push({
					VISIT_ID: visitId,
					ORDER: list[i].order,
					LOC_ID: list[i].locationId
				});
			}

			return LocalizationVisit.bulkCreate(jsonBulk);
		},
		update: function(visitId, order, locId) {
			return LocalizationVisit.update( {
				LOC_ID: locId,
			}, { where: { VISIT_ID: visitId, ORDER: order }});
		},
		createOrUpdate: function(visitId, order, locationId) {

			return LocalizationVisit.findOne({where: {VISIT_ID: visitId, ORDER: order}}).then(function(success) {
				if(success === null) {
					return LocalizationVisit.create( {VISIT_ID: visitId, ORDER: order, LOC_ID: locationId});
				}
				else {
					return LocalizationVisit.update( { LOC_ID: locationId }, { where: { VISIT_ID: visitId, ORDER: order }});
				}
			});
		},
		updateSome: function(visitId, visitsLocations){
			var self = this;

			promises = [];

			for(var i=0; i<visitsLocations.length; i++)
				promises.push(self.createOrUpdate(visitId, visitsLocations[i].order, visitsLocations[i].locationId));

			return Sequelize.Promise.all(promises);
		},
		deleteByVisitId: function(visitId) {
			return LocalizationVisit.destroy({where: {VISIT_ID: visitId}});
		}
	},
	freezeTableName: true
});

module.exports = LocalizationVisit;