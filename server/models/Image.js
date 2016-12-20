var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var Image = DBConnector.connectM4E().define('IMAGE', {
	ID: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
	URL: {type: Sequelize.STRING(200), allowNull: false },
	CONTENT_ID: {type: Sequelize.INTEGER, allowNull: false }
},
{
	instanceMethods: {
		retrieveLast: function() {
			return Image.findOne({order: 'ID DESC'});
		},
		retrieveAll: function() {
			return Image.findAll();
		},
		retrieveAllByContentId: function(contentId) {
			return Image.findAll({ where: {CONTENT_ID: contentId }});
		},
		retrieveAllByContentIds: function(contentIds) {
			return Image.findAll({ where: {CONTENT_ID: {in: contentIds}}});
		},
		retrieveById: function(id) {
			return Image.findOne({where: {ID: id}});
		},
		retrieveAllByListIds: function(listIds) {
			return Image.findAll({where: {ID: {in: listIds}}});
		},
		retrievePagination: function(inicio, fin){
			return Image.findAll({order: 'ID ASC', offset: parseInt(inicio) - 1, limit: parseInt(fin) });
		},
		add: function(url, contentId) {
			return Image.create({
				URL: url,
				CONTENT_ID: contentId
			});
		},
		updateById: function(imageId) {
			return Image.update({
				URL: this.url
			}, {where: {ID: imageId}});
		},
		removeById: function(imageId) {
			return Image.destroy({where: {ID: imageId}});
		},
		removeByContentId: function(contentId) {
			return Image.destroy({where: {CONTENT_ID: contentId}});
		}
	},
	freezeTableName: true
});

module.exports = Image;