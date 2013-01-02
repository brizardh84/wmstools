var mongoose = require('mongoose'),
	Task = mongoose.model('Task');
	
// Listing of tasks
exports.index = function(req, res){
	res.render('tasks', {

	})
}
