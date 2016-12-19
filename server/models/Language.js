var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var Language = DBConnector.connectM4E().define('LANGUAGE', {
	ID: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
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
		retrieveAllDesc: function() {
			return Language.findAll({order: 'ID DESC'});
		},
		retrieveAllByListIds : function(listIds) {
			return Language.findAll({ where: { ID: { in: listIds } } });
		},
		retrieveByCode: function(code) {
			return Language.findOne({where: {CODE: code}});
		},
		add: function(name, flag, code) {
			return Language.create( {
				NAME: name,
				FLAG: flag,
				CODE: code
			});
		},
		updateById: function(id) {
			if(this.flag === '') {
				return Language.update( {
					NAME: this.name,
					CODE: this.code
				}, { where: { ID: id }});
			}
			else {
				return Language.update( {
					NAME: this.name,
					FLAG: this.flag,
					CODE: this.code
				}, { where: { ID: id }});
			}
		},
		removeById: function(id) {
			return Language.destroy( {where: {ID: id }});
		}
	},
	freezeTableName: true
});

module.exports = Language;