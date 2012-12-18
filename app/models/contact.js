// Contact schema

var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var ContactSchema = new Schema({
	email: {
		type: String,
		index: { unique: true }
	},
	name: String,
});

mongoose.model('Contact', ContactSchema);