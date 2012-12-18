// Contact schema

var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var ContactSchema = new Schema({
	firstname : String,
	lastname : String,
	email: {
		type: String,
		index: { unique: true }
	},
	telephone : String
});

mongoose.model('Contact', ContactSchema);