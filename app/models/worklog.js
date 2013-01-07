// Comment schema

var mongoose = require('mongoose'), 
	Schema = mongoose.Schema

var WorklogSchema = new Schema({
	type : {type : String, enum : ['Update', 'Inquiry', 'Follow-up']},
	body: {type : String, default : ''}, 
	
	date : { type : Date},
	email : {
		contacts: [{type : Schema.ObjectId, ref : 'Contact'}], 
		subject : String,
		body : String
	},
	
	// Champs Auto-gestion
	created_date  : {type : Date},
	created_by : {type : Schema.ObjectId, ref : 'User'},
	modified_date : { type : Date},
	modified_by : { type:Schema.ObjectId, ref : 'User'}
});

mongoose.model('Worklog', WorklogSchema);
