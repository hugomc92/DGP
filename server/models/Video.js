var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Export an anonymous function
var Video = DBConnector.connectM4E().define('VIDEO', {
	ID: {type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true},
	URL: {type: Sequelize.STRING(), allowNull: false},
	SUBTITLE: {type: Sequelize.STRING(), allowNull: true},
	ALT_TEXT: {type: Sequelize.STRING(), allowNull: true},
	CONTENT_ID: {type: Sequelize.INTEGER, allowNull: false},
	LANG_ID: {type: Sequelize.INTEGER, allowNull: true},
},
{
	instanceMethods: {
		retrieveLast: function() {
			return Video.findOne({order: 'ID DESC'});
		},
		retrieveAll: function() {
			return Video.findAll({order: 'ID DESC'});
		},
		retrieveById: function(id) {
			return Video.findOne({where: {ID: id}});
		},
		retrieveAllByContentId: function(contentId) {
			return Video.findAll({where: {CONTENT_ID: contentId}});
		},
		retrieveAllByContentIdByLangId: function(contentId, langId) {
			return Video.findAll({where: {CONTENT_ID: contentId, $or: [{LANG_ID: langId}, {LANG_ID: null}] }});
		},
		retrieveAllByContentIds: function(contentIds) {
			return Video.findAll({where: {CONTENT_ID: {in: contentIds }}});
		},
		retrieveAllByListIds: function(listIds) {
			return Video.findAll({where: {ID: {in: listIds}}});
		},
		retrievePagination: function(inicio, fin){
			return Video.findAll({order: 'ID DESC', offset: parseInt(inicio) - 1, limit: parseInt(fin) });
		},
		add: function(url, substitle, altText, contentId, langId) {
			if(langId === null) {
				return Video.create( {
					URL: url,
					CONTENT_ID: contentId,
				});
			}
			else {
				return Video.create( {
					URL: url,
					SUBTITLE: substitle,
					ALT_TEXT: altText,
					CONTENT_ID: contentId,
					LANG_ID: langId
				});
			}
		},
		updateById: function(id) {
			if(this.url === null && this.subtitle === null) {
				return Video.update( {
					ALT_TEXT: this.altText,
					LANG_ID: this.langId
				}, {where: {ID: id}});
			}
			else if(this.url === null) {
				return Video.update( {
					SUBTITLE: this.subtitle,
					ALT_TEXT: this.altText,
					LANG_ID: this.langId
				}, {where: {ID: id}});
			}
			else if(this.subtitle === null) {
				return Video.update( {
					URL: this.url,
					ALT_TEXT: this.altText,
					LANG_ID: this.langId
				}, {where: {ID: id}});
			}
			else {
				return Video.update( {
					URL: this.url,
					SUBTITLE: this.subtitle,
					ALT_TEXT: this.altText,
					LANG_ID: this.langId
				}, {where: {ID: id}});
			}
		},
		removeById: function(id) {
			return Video.destroy({where: {ID: id}});
		}
	},
	freezeTableName: true
});

module.exports = Video;