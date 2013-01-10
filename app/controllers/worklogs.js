var mongoose = require('mongoose'), 
	Worklog = mongoose.model('Worklog');

exports.create = function (req, res) {
	var worklog = new Worklog(req.body), 
		task = req.task;
	
	// Auto-update de la création
	worklog.created_date = new Date;
	worklog.created_by = req.user;
	
	worklog.save(function (err) {
		if (err) {
			console.log("Error : " + err);
			//throw new Error('Error while saving worklog');
			res.render('tasks/show', {
				worklogs : req.worklogs,
				task: task,
				worklog : req.body,
				errors : err.errors
			})
		} else {
			task.worklogs.push(worklog._id);
			
			task.save(function (err) {
				if (err) {
					throw new Error('Error while saving task');
				}	
				res.redirect('/tasks/'+task.id+'#worklogs');
			})
		}
	})
}
