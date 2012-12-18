var mongoose = require('mongoose'), 
	Contact = mongoose.model('Contact'), 
	_ = require('underscore')
	
// New contact
exports.new = function(req, res){
	res.render('contacts/new', {
		title: 'New Contact', 
		contact: new Contact({})
	})
}

exports.create = function (req, res) {
	var contact = new Contact(req.body);

	contact.user = req.user;
		
	contact.save(function(err){
		if (err) {
			res.render('contacts/new', {
				title: 'New Contact', 
				contact: contact, 
				errors: err.errors
			})
		} else {
			res.redirect('/contacts/'+contact._id)
		}
	})
}

// Edit a contact
exports.edit = function (req, res) {
	res.render('contacts/edit', {
		title: 'Edit ' + req.contact.name,
		contact: req.contact
	})
}

// Update contact
exports.update = function(req, res){
	var contact = req.contact

	contact = _.extend(contact, req.body)

	contact.save(function(err, doc) {
		if (err) {
			res.render('contacts/edit', {
 				title: 'Edit Contact', 
 				contact: contact, 
 				errors: err.errors
			})
		} else {
			res.redirect('/contacts/'+contact._id)
		}
	})
}

// View a contact
exports.show = function(req, res){
	res.render('contacts/show', {
		name: req.contact.name,
		contact: req.contact
	})
}

// Delete a contact
exports.destroy = function(req, res){
	var contact = req.contact
	contact.remove(function(err){
		res.redirect('/contacts')
	})
}

// Listing of Contacts
exports.index = function(req, res){
	var perPage = 5, 
		page = req.param('page') > 0 ? req.param('page') : 0

	Contact
		.find({})
		.populate('user', 'name')
		.sort({'name': 1}) // sort by date
		.limit(perPage)
		.skip(perPage * page)
		.exec(function(err, contacts) {
			if (err) {
				return res.render('500')
			}
			
			Contact.count().exec(function (err, count) {
				res.render('contacts/index', {
					title: 'List of Contacts', 
					contacts: contacts, 
					page: page, 
					pages: count / perPage
				})
			})
		})
}
