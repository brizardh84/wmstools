// Task schema

var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var TaskSchema = new Schema({
	title : String,
	description : String
});

mongoose.model('Task', TaskSchema);