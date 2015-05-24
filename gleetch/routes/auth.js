var app      = require('../../app');
var settings = app.get('config_settings');
var jwt      = require('jwt-simple');
var mongoose = require('mongoose');

module.exports = function(req, res){
	var key    = req.body.key || '';
	var secret = req.body.secret || '';

	if (key == '' || secret == '') {
		res.status(401);
		res.json({
			"status": 401,
			"message": "Invalid credentials"
		});
		return;
	}

	mongoose.model(settings.mongodb.db_users).find({api_key: key, api_secret: secret}, function(err, users) {

		if(!users.length){

			res.status(401);
			res.json({
				"status": 401,
				"message": "Invalid credentials"
			});
			return;

		}else{

			var dateObj = new Date();
			var expires =  dateObj.setDate(dateObj.getDate() + settings.api.token_expiration);
			var token   = jwt.encode({
				exp: expires
			}, settings.api.secret);

			res.json({
				"token": token,
				"key": key,
				"expires": expires
			});

		}

	});
};