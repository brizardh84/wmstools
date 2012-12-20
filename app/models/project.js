// Project schema

var mongoose = require('mongoose'), 
	Schema = mongoose.Schema;

var getTags = function (tags) {
	return tags.join(',');
}

var setTags = function (tags) {
	return tags.split(',');
}

var ProjectSchema = new Schema({
	title: {type : String, default : '', trim : true}, 
	number : {type : String, default : '', trim : true },
	description: {type : String, default : '', trim : true}, 
	user: {type : Schema.ObjectId, ref : 'User'}, 
	comments: [{type : Schema.ObjectId, ref : 'Comment'}], 
	contacts: [{type : Schema.ObjectId, ref : 'Contact'}], 
	tags: {type: [], get: getTags, set: setTags}, 
	location : {
		city : String,
		country : String,
		coordinates : {
			latitude : {type: Number, min: -90, max: 90},
			longitude : {type: Number, min: -180, max: 180}
		}
	},
	createdAt  : {type : Date, default : Date.now}
});

ProjectSchema.path('title').validate(function (title) {
	return title.length > 0;
}, 'Project title cannot be blank');

ProjectSchema.path('number').validate(function (number) {
	return number.length == 6;
}, 'Project number must be 6 caracters long');

ProjectSchema.path('description').validate(function (description) {
	return description.length > 0
}, 'Project description cannot be blank');

mongoose.model('Project', ProjectSchema);
