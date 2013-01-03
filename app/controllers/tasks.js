var mongoose = require('mongoose'),
	Task = mongoose.model('Task'),
	Project = mongoose.model('Project'),
	User = mongoose.model('User'),
	async = require('async'),
	_ = require('underscore');
	
// New project
exports.new = function(req, res){
	Project
		.find()
		.sort({'number': 1})
		.exec(function(err, projects) {
			User
				.find()
				.sort({'name': 1})
				.exec(function(err, users) {
					res.render('tasks/new', {
						title: 'New Task', 
						task: new Task({}),
						projects: projects,
						users : users
					});
				})
		});
}

// Create a task
exports.create = function (req, res) {
	var task = new Task(req.body);

	task.user = req.user;
	
	Task.count().exec(function (err, count) {
  		task.number = count + 1;
  		task.save(function(err){
			if (err) {
				res.render('tasks/new', {
					title: 'New Task', 
					task: task, 
					errors: err.errors
				});
			} else {
				res.redirect('/tasks');
			}
		});
	});
	

}

// Edit a task
exports.edit = function (req, res) {
	Project
		.find()
		.sort({'number': 1})
		.exec(function(err, projects) {
			User
				.find()
				.sort({'name': 1})
				.exec(function(err, users) {
					res.render('tasks/edit', {
						title: 'New Task', 
						task: req.task,
						projects: projects,
						users : users
					});
				})
		});
}

// Update task
exports.update = function(req, res){
	var task = req.task

	task = _.extend(task, req.body)
	
	task.save(function(err, task) {
		if (err) {
			res.render('tasks/edit', {
 				title: 'Edit Task', 
 				task: task, 
 				errors: err.errors
			})
		} else {
			res.redirect('/tasks')
		}
	})
}

// View a task
exports.show = function(req, res){
	res.render('tasks/show', {
		task: req.task
	})
}

// Delete a task
exports.destroy = function(req, res){
	var task = req.task
	task.remove(function(err){
		res.redirect('/tasks');
	})
}


// Listing of tasks
exports.index = function(req, res){
	var perPage = 50, 
		page = req.param('page') > 0 ? req.param('page') : 0

	var project_filter = req.param('project_filter') || "";
	var user_filter = req.param('user_filter') || "";
	var filters = {};
	
	if (project_filter != "")
		filters.project = project_filter;
	
	if (user_filter != "")
		filters.assigned_to = user_filter;

	async.parallel(
		{
			projects : function(callback) {
				Project
					.find()
					.sort({'number' : 1})
					.exec(function(err, projects) {
						callback(err, projects);
					})
			},
			users : function(callback) {
				User
					.find()
					.sort({'name' : 1})
					.exec(function(err, users) {
						callback(err, users);
					})
			}
		},
		function(err, collections) {
			Task
				.find(filters)
				.populate('assigned_to')
				.populate('project')
				.sort({'created_date': -1}) // sort by date
				.limit(perPage)
				.skip(perPage * page)
				.exec(function(err, tasks) {
					if (err) {
						return res.render('500')
					}
					
					tasks.forEach(function(task) {
						task.isLate = new Date() > task.due_date;
					});
					
					Task.count().exec(function (err, count) {
						res.render('tasks/index', {
							title: 'List of Tasks', 
							tasks: tasks, 
							page: page, 
							pages: count / perPage,
							count : count,
							collections : collections,
							project_filter : project_filter,
							user_filter : user_filter
						})
					});
				})
		}
	);


}
