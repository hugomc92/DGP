var crypto = require('crypto');

var Sequelize = require("sequelize");
var DBConnector = require("../utils/DBConnector");

// Exporto una funcion anonima
var User = DBConnector.connectM4E().define('USER', {
	ID: { type: Sequelize.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
	EMAIL: { type: Sequelize.STRING(190), unique: true, allowNull: false },
	PASSWORD: { type: Sequelize.STRING(500), allowNull: false },
	NAME: { type: Sequelize.STRING(200), allowNull: false },
	SURNAME: { type: Sequelize.STRING(200), allowNull: false },
	PHOTO: {type: Sequelize.STRING(500), allowNull: true},
	RESET_TOKEN: { type: Sequelize.STRING(500), allowNull: true },
	FAIL_LOGIN: { type: Sequelize.INTEGER, allowNull: true },
	ADMIN: { type: Sequelize.INTEGER, allowNull: false },
	SUPER_ADMIN: { type: Sequelize.INTEGER, allowNull: false },
	ACTIVE: { type: Sequelize.INTEGER, allowNull: false }
},
{
	instanceMethods: {
		retrieveById: function(id) {
			return User.findOne({ where: { ID: id } });
		},
		retrieveAllByListIds: function(listIds) {
			return User.findAll({ where: { ID: { in: listIds } } });
		},
		retrieveByEmail: function(email){
			return User.findOne({ where: { EMAIL: email } });
		},
		retrievePagination: function(inicio, fin){
			return User.findAll({order: 'ID DESC', offset: parseInt(inicio) - 1, limit: parseInt(fin) });
		},
		retrieveLastAdded: function() {
			return User.findOne( { order: 'ID DESC' });
		},
		searchUsers: function(username) {
			return User.findAll({ where: { $or: [ { NAME: { $like: '%'+username+'%'} }, { SURNAME: { $like: '%'+username+'%'} } ] } });
		},
		add: function(email, password, name, surname, photo, admin) {
			var shasum = crypto.createHash('sha1');
			shasum.update(password);
			password = shasum.digest('hex');

			return User.create({
				EMAIL: email,
				PASSWORD: password,
				NAME: name,
				SURNAME: surname,
				PHOTO: photo,
				RESET_TOKEN: '',
				FAIL_LOGIN: 0,
				ADMIN: admin,
				SUPER_ADMIN: 0,
				ACTIVE: 1
			});
		},
		updateById: function(user_id){
			return User.update({
				EMAIL: this.email,
				PASSWORD: this.password,
				NAME: this.name,
				SURNAME: this.surname,
				PHOTO: this.photo,
			}, { where: {ID: user_id} });
		},
		updateFailLogin: function(email) {
			return User.update({FAIL_LOGIN: this.fail_login},{ where: {EMAIL: email} });
		},
		removeById: function(user_id){
			return User.update({ACTIVE: 0},{ where: {ID: user_id} });
		}
	},
	freezeTableName: true,
});

module.exports = User;