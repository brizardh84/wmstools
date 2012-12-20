var mongoose = require('mongoose'), 
	Project = mongoose.model('Project');
	
// Listing of documents
exports.index = function(req, res){
	Project
		.find()
		.select('number title')
		.sort({'number': 1}) // sort by date
		.exec(function(err, projects) {
			if (err) {
				return res.render('500')
			}
			
			selectedproject = req.param('project') || "";
			
			Project.count().exec(function (err, count) {
				res.render('documents/index', {
					title: 'List of Documents', 
					projects: projects,
					selectedproject : selectedproject
				})
			})
		})
		
}