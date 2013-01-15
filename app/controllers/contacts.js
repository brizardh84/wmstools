var mongoose = require('mongoose'), 
	Contact = mongoose.model('Contact'), 
	Project = mongoose.model('Project'),
	_ = require('underscore')
	
// New contact
exports.new = function(req, res){
	res.render('contacts/new', {
		title: 'Contacts', 
		contact: new Contact({})
	})
}

exports.create = function (req, res) {
	var contact = new Contact(req.body);

	contact.user = req.user;
		
	contact.save(function(err){
		if (err) {
			res.render('contacts/new', {
				title: 'Contacts', 
				contact: contact, 
				errors: err.errors
			})
		} else {
			res.redirect('/contacts')
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
 				title: 'Contacts', 
 				contact: contact, 
 				errors: err.errors
			})
		} else {
			res.redirect('/contacts')
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
	var search = req.param('search') || "";
	var regexSearch = new RegExp(search, "i");
		
	Contact
		.find({ $or:[ {lastname : regexSearch}, {firstname : regexSearch} ] })
		.sort({'lastname': 1}) // sort by date
		.exec(function (err, contacts) {
			if (err) {
				return res.render('500')
			}
			var letters = [];
			
			contacts.forEach(function(contact) {
				if (contact.lastname) {
					if (letters.indexOf(contact.lastname.charAt(0)) == -1)
						letters += contact.lastname.charAt(0);
				}
			})
			
			Contact.count().exec(function (err, count) {
		  		res.render('contacts/index', {
					title: 'Contacts', 
					contacts: contacts,
					letters : letters,
					p_search : search,
					count : count
				});
			});
		});
}
