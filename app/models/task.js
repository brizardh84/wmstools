// Task schema

var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var TaskSchema = new Schema({
	number : Number,
	project: {type : Schema.ObjectId, ref : 'Project'}, 
	completion : {type: Number, default : 0, min : 0, max : 100},
	task : {type: String, trim : true},
	description : {type: String, trim : true},
	assigned_to : {type : Schema.ObjectId, ref : 'User'}, 
	priority : {type : String, enum : ['Very high', 'High', 'Normal', 'Low']},
	due_date : {type : Date},
	worklogs: [{type : Schema.ObjectId, ref : 'Worklog'}], 
	
	// Champs Auto-gestion
	created_date  : {type : Date},
	created_by : {type : Schema.ObjectId, ref : 'User'},
	modified_date : { type : Date},
	modified_by : { type:Schema.ObjectId, ref : 'User'}
});

mongoose.model('Task', TaskSchema);