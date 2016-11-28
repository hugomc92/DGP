var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var ContentType = DBConnector.connectM4E().define('CONTENT_TYPE', {
	ID: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
	NAME: {type: Sequelize.STRING(200), allowNull: false},
	DESCRIPTION: {type: Sequelize.STRING(500), allowNull: true},
	ICON: {type: Sequelize.STRING(500), allowNull: true}
},
{
	instanceMethods: {
		retrieveAll: function() {
			return ContentType.findAll();
		},
		retrieveById: function(id) {
			return ContentType.findOne({where: {ID: id}});
		},
		retrieveAllByListIds: function(listIds) {
			return ContentType.findAll({where: {ID: {in: listIds}}});
		},
		retrievePagination: function(inicio, fin){
			return ContentType.findAll({order: 'ID DESC', offset: parseInt(inicio) - 1, limit: parseInt(fin) });
		},
		add: function(name, description, icon) {
			return ContentType.create({
				NAME: name,
				DESCRIPTION: description,
				ICON: icon
			});
		},
		updateById: function(content_type_id) {
			return ContentType.update({
				NAME: this.name,
				DESCRIPTION: this.description,
				ICON: this.icon
			}, {where: {ID: content_type_id}});
		},
		removeById: function(content_type_id) {
			return ContentType.destroy({where: {ID: content_type_id}});
		}
	},
	freezeTableName: true
});

module.exports = ContentType;
