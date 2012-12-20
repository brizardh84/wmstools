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
	phone : String,
	extension : String
});

ContactSchema.virtual('fullname').get(function() {
	return this.firstname + " " + this.lastname;
});

ContactSchema.virtual('fullname_inverted').get(function() {
	return  this.lastname + ", " + this.firstname;
});

mongoose.model('Contact', ContactSchema);