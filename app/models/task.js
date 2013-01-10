// Task schema
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	moment = require('moment'),
	dateMask = 'YYYY-MM-DD';

var TaskSchema = new Schema({
	number : {type: Number},
	project: {type : Schema.Types.ObjectId, ref : 'Project'}, 
	completion : {type: Number, default : 0, min : 0, max : 100},
	task : {type: String, trim : true},
	description : {type: String, trim : true},
	assigned_to : {type : Schema.Types.ObjectId, ref : 'User'}, 
	priority : {type : String, enum : ['Very high', 'High', 'Normal', 'Low']},
	due_date : {type : Date},
	worklogs: [{type : Schema.Types.ObjectId, ref : 'Worklog'}], 
	
	// Champs Auto-gestion
	created_date  : {type : Date},
	created_by : {type : Schema.Types.ObjectId, ref : 'User'},
	modified_date : { type : Date},
	modified_by : { type:Schema.Types.ObjectId, ref : 'User'}
});


TaskSchema.path('task').validate(function (task) {
	return task.length > 0
}, 'Task title cannot be blank');

TaskSchema.path('project').validate(function (project) {
	return project !== null
}, 'Project cannot be blank');

TaskSchema.path('completion').validate(function (completion) {
	return completion >= 0 && completion <= 100;
}, 'Completion must be between 0 and 100');

TaskSchema.virtual('due_date_yyyymmdd').get(function() {
	return moment(this.due_date).format(dateMask);
});

mongoose.model('Task', TaskSchema);