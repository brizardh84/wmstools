
var mongoose = require('mongoose'), 
	Project = mongoose.model('Project'), 
	User = mongoose.model('User'),
	Contact = mongoose.model('Contact'), 
	Task = mongoose.model('Task'), 
	async = require('async');

module.exports = function (app, passport, auth) {

	// user routes
	var users = require('../app/controllers/users');
	app.get('/login', users.login);
	app.get('/signup', users.signup);
	app.get('/logout', users.logout);
	app.post('/users', users.create);
	app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login'}), users.session);
	app.get('/users/:userId', users.show);
	app.param('userId', function (req, res, next, id) {
		User
			.findOne({ _id : id })
			.exec(function (err, user) {
				if (err) {
					return next(err);
				}
				if (!user) {
					return next(new Error('Failed to load User ' + id));
				}
				req.profile = user;
				next();
			})
	})
	
	// project routes
	var projects = require('../app/controllers/projects');
	app.get('/projects', auth.requiresLogin, projects.index);
	app.get('/projects/new', auth.requiresLogin, projects.new);
	app.post('/projects', auth.requiresLogin, projects.create);
	app.get('/projects/:projectId', auth.requiresLogin, projects.show);
	app.get('/projects/:projectId/edit', auth.requiresLogin, auth.project.hasAuthorization, projects.edit);
	app.get('/projects/generate_preproposition/:projectId', auth.requiresLogin, auth.project.hasAuthorization, projects.generate_preproposition);
	app.put('/projects/:projectId', auth.requiresLogin, auth.project.hasAuthorization, projects.update);
	app.del('/projects/:projectId', auth.requiresLogin, auth.project.hasAuthorization, projects.destroy);
	app.param('projectId', function(req, res, next, id){
		Project
			.findOne({ _id : id })
			.populate('user', 'name')
			.populate('comments')
			.exec(function (err, project) {
				if (err) {
					return next(err);
				}
 				if (!project) {
 					return next(new Error('Failed to load project ' + id));
 				}
 				req.project = project;

				// On veut ajouter l'information sur le user du commentaire
 				var populateComments = function (comment, cb) {
	 				User
						.findOne({ _id: comment._user })
	  					.select('name')
						.exec(function (err, user) {
							if (err) {
								return next(err);
							}
							comment.user = user;
							cb(null, comment);
						})
        		}

				if (project.comments.length) {
					async.map(req.project.comments, populateComments, function (err, results) {
						next(err);
					})
				} else {
					next();
				}
			})
	})

	// contacts routes
	var contacts = require('../app/controllers/contacts');
	app.get('/contacts', auth.requiresLogin, contacts.index);
	app.get('/contacts/new', auth.requiresLogin, contacts.new);
	app.post('/contacts', auth.requiresLogin, contacts.create);
	app.get('/contacts/:contactId', contacts.show);
	app.get('/contacts/:contactId/edit', auth.requiresLogin, contacts.edit);
	app.put('/contacts/:contactId', auth.requiresLogin, contacts.update);
	app.del('/contacts/:contactId', auth.requiresLogin, contacts.destroy);
	app.param('contactId', function(req, res, next, id){
		Contact
			.findOne({ _id : id })
			.populate('user', 'name')
			.exec(function (err, contact) {
				if (err) {
					return next(err);
				}
 				if (!contact) {
 					return next(new Error('Failed to load contact ' + id));
 				}
 				req.contact = contact;
 				next();
			})
	})
	
	// documents routes
	var documents = require('../app/controllers/documents');
	app.get('/documents/', auth.requiresLogin, documents.index);
	
	// tasks routes
	var tasks = require('../app/controllers/tasks');
	app.get('/tasks/', auth.requiresLogin, tasks.index);
	app.get('/tasks/new', auth.requiresLogin, tasks.new);
	app.post('/tasks', auth.requiresLogin, tasks.create);
	app.get('/tasks/:taskId', tasks.show);
	app.get('/tasks/:taskId/edit', auth.requiresLogin, tasks.edit);
	app.put('/tasks/:taskId', auth.requiresLogin, tasks.update);
	app.del('/tasks/:taskId', auth.requiresLogin, tasks.destroy);
	app.param('taskId', function(req, res, next, id){
		Task
			.findOne({ _id : id })
			.populate('assigned_to')
			.populate('worklogs', null, null, {sort : [['date', 1]]})
			.exec(function (err, task) {
				if (err) {
					return next(err);
				}
 				if (!task) {
 					return next(new Error('Failed to load task ' + id));
 				}
 				req.task = task; 				 			
				
				// On veut ajouter l'information sur le user du commentaire
 				var populateWorklogs = function (worklog, cb) {
	 				User
						.findOne({ _id: worklog.created_by })
	  					.select('name')
						.exec(function (err, user) {
							if (err) {
								return next(err);
							}
							worklog.author = user;
							cb(null, worklog);
						})
        		}

				if (task.worklogs.length) {
					async.map(req.task.worklogs, populateWorklogs, function (err, results) {
						next(err);
					})
				} else {
					next();
				}
			})
	})
	
	// worklog routes
	var worklogs = require('../app/controllers/worklogs');
	app.post('/tasks/:taskId/worklogs', auth.requiresLogin, worklogs.create);
	
	// home route
	app.get('/', auth.requiresLogin, projects.index);

	// comment routes
	var comments = require('../app/controllers/comments');
	app.post('/projects/:projectId/comments', auth.requiresLogin, comments.create);

	// tag routes
	var tags = require('../app/controllers/tags');
	app.get('/tags/:tag', auth.requiresLogin, tags.index);

}
