var express         = require('express');
var app             = module.exports = express(); 
var YAML            = require('yamljs');
var bodyParser      = require('body-parser');
var settings        = YAML.load(__dirname + '/config/settings.yml');
var data            = YAML.load(__dirname + '/config/data.yml');
var port            = process.env.PORT || settings.server.port;
var mongoose        = require('mongoose');
var mongoConnectUri = '';

function initMongoDB() {
	if (settings.mongodb.user != "" && settings.mongodb.password != "") {
		mongoConnectUri = settings.mongodb.user + ':' + settings.mongodb.password + '@'
	}

	mongoose.connect('mongodb://' + mongoConnectUri + settings.mongodb.host + ':' + settings.mongodb.port);

	var db = mongoose.connection;

	db.on('error', function() {
		console.log('[!] MongoDB connection error!');
		process.exit();
	});

	db.once('open', function() {
		console.log('MongoDB connection success!');
		initApp();
	});
}

function initApp() {
	var userModel = mongoose.model( settings.mongodb.db_users, require('./gleetch/schemas/user') );
	
	app.set('model_user', userModel);

	mongoose.model(settings.mongodb.db_users).find({email: settings.admin.email}, function(err, users) {
		if (!users.length) {
			var admin = new userModel({
				firstname: settings.admin.firstname,
				lastname: settings.admin.lastname,
				email: settings.admin.email,
				api_key: settings.admin.api_key,
				api_secret: settings.admin.api_secret,
				scope: ['admin']
			});
			admin.save(function(err) {
				if (err) return handleError(err);
				console.log("Admin user added.");
			});
		};
	});

	app
		.use( bodyParser.urlencoded({extended: false}) )
		.use( bodyParser.json() )
		.set('x-powered-by', false)
		.set('config_settings', settings)
		.set('config_data', data);

	app.get('/', function(req, res, next) {
		res.sendFile(__dirname + '/gleetch/index.html');
	});

	app.use('/api/', require('./gleetch/routes/routes'));

	app.use(function(req, res, next) {
		res.status(404);
		res.send("<h1>Page Not Found</h1>");
	});

	app.listen(port, function() {
		console.log("Gleetch is listening on port " + port + '. Enjoy!');
	});
}

initMongoDB();