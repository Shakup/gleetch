var app      = require('../app');
var settings = app.get('config_settings');
var data     = app.get('config_data');
var mongoose = require('mongoose');

module.exports = {

	setHeaders: function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
		res.header("X-Powered-By", "Gleetch");

		if (req.method == 'OPTIONS') {
			res.status(200).end();
		} else {
			next();
		}
	},

	setBadRequest: function(req, res) {
		res.status(400);
		res.json({
			status: 400,
			message: "Bad Request"
		});
	},

	setNotAuthorized: function(req, res) {
		res.status(403);
		res.json({
			"status": 403,
			"message": "Not Authorized"
		});
		return;
	},

	isData: function(data) {
		return data.hasOwnProperty(data);
	},

	getMetric: function(data, next) {
		return {};
	},

	getUsers: function(next) {
		mongoose.model(settings.mongodb.db_users).find(function(err, users) {
			next(users);
		});
	}

};