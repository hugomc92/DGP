var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var LocalizationVisit = DBConnector.connectM4E().define('LOCALIZATION_VISIT', {
	LOC_ID: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
	VISIT_ID: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
	ORDER: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false },
},
{
	instanceMethods: {
		retrieveAll: function() {
			return LocalizationVisit.findAll();
		},
		add: function(locId, visitId, order) {
			return LocalizationVisit.create( {
				LOC_ID: locId,
				VISIT_ID: visitId,
				ORDER: order
			});
		},
		addSome: function(list, visitId) {
			var jsonBulk = [];

			for(var i=0; i<list.length; i++) {
				jsonBulk.push({
					LOC_ID: list[i].locationId,
					VISIT_ID: visitId,
					ORDER: list[i].order
				});
			}

			return LocalizationVisit.bulkCreate(jsonBulk);
		},
		update: function() {
			return LocalizationVisit.update( {
				LOC_ID: this.locId,
			}, { where: { LOC_ID: this.locId, VISIT_ID: this.visitId, ORDER: this.order }});
		}
	},
	freezeTableName: true
});

module.exports = LocalizationVisit;