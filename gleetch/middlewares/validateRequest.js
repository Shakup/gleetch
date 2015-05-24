var app      = require('../../app');
var settings = app.get('config_settings');
var api      = require('../api');
var jwt      = require('jwt-simple');
var mongoose = require('mongoose');

module.exports = function(req, res, next) {

	if(req.method == 'OPTIONS') next();

	var token = req.headers['x-access-token'];
	var key   = req.headers['x-key'];

	if (token || key) {
		try {
			var decoded = jwt.decode(token, settings.api.secret);

			if (decoded.exp <= Date.now()) {
				res.status(400);
				res.json({
					"status": 400,
					"message": "Token Expired"
				});
				return;
			}

			mongoose.model(settings.mongodb.db_users).find({api_key: key}, function(err, users) {
				if(users.length){
					next();
				} else {
					api.setNotAuthorized();
					return;
				}
			});

		} catch (err) {
			
			res.status(401);
			res.json({
				"status": 401,
				"message": "Invalid Token or Key"
			});
			return;

		}

	} else {
	
		api.setNotAuthorized();
		return;

	}
};