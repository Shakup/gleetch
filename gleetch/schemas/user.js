var mongoose = require('mongoose');

module.exports = mongoose.Schema({
	firstname: String,
	lastname: String,
	email: {type: String, required: true, unique: true },
	api_key: {type: String, required: true},
	api_secret: {type: String, required: true},
	scope: Array,
	created_at: Date
}, {versionKey: '_version'});