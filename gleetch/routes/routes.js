var app             = require('../../app');
var express         = require('express');
var router          = express.Router();
var api             = require('../api');
var validateRequest = require('../middlewares/validateRequest');

router.all('/*', api.setHeaders);

router.post('/auth', require('./auth'));

router.all('/*', validateRequest);

router.get('/users', function(req, res) {
	api.getUsers(function(users) {
		res.json( users );
	});
});

router.get('/data/:data', function(req, res) {

	var data = req.params.data;

	if (!api.isData(data)) {
		api.setBadRequest(req, res);
		return;
	};

	res.json( api.getData(data) );

});

router.all('/*', api.setBadRequest);

module.exports = router;