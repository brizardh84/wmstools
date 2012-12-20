var mongoose = require('mongoose'), 
	Project = mongoose.model('Project'),
	Contact = mongoose.model('Contact'),  
	_ = require('underscore'),
	nodefs = require('node-fs'),
	PDFDocument = require('pdfkit')

// New project
exports.new = function(req, res){
	Contact.find().exec(function(err, contacts) {
		res.render('projects/new', {
			title: 'New Project', 
			project: new Project({}),
			contacts: contacts
		});
	});
}

// Create a project
exports.create = function (req, res) {
	var project = new Project(req.body);

	project.user = req.user;
	
	project.save(function(err){
		if (err) {
			res.render('projects/new', {
				title: 'New Project', 
				project: project, 
				errors: err.errors
			});
		} else {
			res.redirect('/projects/'+project._id);
		}
	});
}

// Edit an project
exports.edit = function (req, res) {
	Contact
		.find()
		.sort({'lastname': 1})
		.exec(function(err, contacts) {
			res.render('projects/edit', {
				title: 'Edit ' + req.project.title,
				project: req.project,
				contacts : contacts
			});
		});
}

// Update project
exports.update = function(req, res){
	var project = req.project

	project = _.extend(project, req.body)
	
	// il doit y avoir une façon plus simple de faire cela.
	project.location.country = req.body.country;
	project.location.city = req.body.city;
	project.location.coordinates.latitude = req.body.latitude;
	project.location.coordinates.longitude = req.body.longitude;

	project.save(function(err, doc) {
		if (err) {
			res.render('projects/edit', {
 				title: 'Edit Project', 
 				project: project, 
 				errors: err.errors
			})
		} else {
			res.redirect('/projects/'+project._id)
		}
	})
}

// View an project
exports.show = function(req, res){
	res.render('projects/show', {
		title: req.project.title,
		project: req.project,
		comments: req.comments,
		generatedpdf : false
	})
}

// Delete an project
exports.destroy = function(req, res){
	var project = req.project
	project.remove(function(err){
		res.redirect('/projects');
	})
}

// Listing of Projects
exports.index = function(req, res){
	var perPage = 5, 
		page = req.param('page') > 0 ? req.param('page') : 0

	Project
		.find({})
		.populate('user', 'name')
		.populate('contacts')
		.sort({'number': 1}) // sort by date
		.limit(perPage)
		.skip(perPage * page)
		.exec(function(err, projects) {
			if (err) {
				return res.render('500')
			}
			
			Project.count().exec(function (err, count) {
				res.render('projects/index', {
					title: 'List of Projects', 
					projects: projects, 
					page: page, 
					pages: count / perPage,
					count : count
				})
			})
		})
}

// Generating PDF
exports.generate_preproposition = function(req, res) {
	var project = req.project
				
	doc = new PDFDocument()
		
	// Add another page
	doc.addPage()
	   .fontSize(25)
	   .text('Here is some vector graphics...', 100, 100)
	
	// Draw a triangle
	doc.save()
	   .moveTo(100, 150)
	   .lineTo(100, 250)
	   .lineTo(200, 250)
	   .fill("#FF3300")
	
	// Apply some transforms and render an SVG path with the 'even-odd' fill rule
	doc.scale(0.6)
	   .translate(470, -380)
	   .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
	   .fill('red', 'even-odd')
	   .restore()
	
	// Add some text with annotations
	doc.addPage()
	   .fillColor("blue")
	   .text('Here is a link!', 100, 100)
	   //.underline(100, 100, 160, 27, color: "#0000FF")
	   .link(100, 100, 160, 27, 'http://google.com/')
	
	// Write the PDF file to disk
	var path = 'doc/' + project.number + '/Prepropositions';
	nodefs.mkdir(path, 0777, true, function(err) {
		if (err) {
			console.log(err);
		} else {
			doc.write(path + "/2.pdf");
			res.render('projects/show', {
				project: project,
				generatedpdf : true
			})
		}
	});	
}

