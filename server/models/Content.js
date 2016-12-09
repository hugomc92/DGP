var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var Content = DBConnector.connectM4E().define('CONTENT', {
	ID: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
	CREATION_DATE: {type: Sequelize.DATE, allowNull: false},
	DATE_IN: {type: Sequelize.DATE, allowNull: false},
	DATE_OUT: {type: Sequelize.DATE, allowNull: false},
	LOCALIZATION_ID: {type: Sequelize.INTEGER, allowNull: true},
	CONTENT_TYPE_ID: {type: Sequelize.INTEGER, allowNull: false}
},
{
	instanceMethods: {
		retrieveLast: function() {
			return Content.findOne({order: 'ID DESC'});
		},
		retrieveById: function(id) {
			return Content.findOne({where: {ID: id}});
		},
		retrieveAllByListIds: function(listIds) {
			return Content.findAll({where: {ID: {in: listIds}}});
		},
		retrievePagination: function(inicio, fin){
			return Content.findAll({order: 'ID DESC', offset: parseInt(inicio) - 1, limit: parseInt(fin) });
		},
		retrievePaginationByType: function(content_type_id, inicio, fin){
			return Content.findAll({ where: {CONTENT_TYPE_ID: content_type_id}}, {order: 'ID DESC', offset: parseInt(inicio) - 1, limit: parseInt(fin) });
		},
		add: function(dateIn, dateOut, locationId, contentTypeID) {
			return Content.create( {
				CREATION_DATE: new Date(),
				DATE_IN: dateIn,
				DATE_OUT: dateOut,
				LOCALIZATION_ID: locationId,
				CONTENT_TYPE_ID: contentTypeID
			});
		},
		updateById: function(id) {
			return Content.update( {
				DATE_IN: this.dateIn,
				DATE_OUT: this.dateOut,
				LOCALIZATION_ID: this.locationId,
				CONTENT_TYPE_ID: this.contentTypeID
			}, {where: {ID: id}});
		}
	},
	freezeTableName: true
});

module.exports = Content;