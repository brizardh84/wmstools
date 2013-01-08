var mongoose = require('mongoose'), 
	User = mongoose.model('User'),
	async = require('async');

exports.signin = function (req, res) {}

// auth callback
exports.authCallback = function (req, res, next) {
	res.redirect('/');
}

// login
exports.login = function (req, res) {
	res.render('users/login', {
		title: 'Login'
	})
}

// sign up
exports.signup = function (req, res) {
	res.render('users/signup', {
		title: 'Sign up'
	})
}

// logout
exports.logout = function (req, res) {
	req.logout();
	res.redirect('/login');
}

// session
exports.session = function (req, res) {
	res.redirect('/');
}

// signup
exports.create = function (req, res) {
	var user = new User(req.body);
	user.provider = 'local';
	user.save(function (err) {
		if (err) {
			return res.render('users/signup', { errors: err.errors })
		}
		req.logIn(user, function(err) {
			if (err) {
				return next(err);
			}
			return res.redirect('/')
		});
  });
}

// show profile
exports.show = function (req, res) {
	var user = req.profile;
	
	res.render('users/show', {
		title: user.name, 
		user: user
	});
}

// get list
exports.getAll = function(req, res) {
	User
		.find()
		.sort({'name' : 1})
		.exec(function(err, users) {
			var populateUsers = function(user, cb) {
				user = { value : user._id, text : user.name};
				cb(null, user);
			}
	
			async.map(users, populateUsers, function(err, results) {
				res.send(results);
			})
		});
}
