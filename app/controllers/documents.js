var mongoose = require('mongoose'), 
	Project = mongoose.model('Project'),
	fs = require('fs');
	
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
			
			/*if (selectedproject != "") {
				if (fs.existsSync('doc/' + selectedproject)) {
					walk('doc/' + selectedproject, function(err, results) {
						if (err) throw err;
						files = results;
					})
				} else {
					files = [];
				}
			} else {
				files = [];
			}*/
			
			Project.count().exec(function (err, count) {
				res.render('documents/index', {
					title: 'List of Documents', 
					projects: projects,
					selectedproject : selectedproject,
					//files : files
				})
			})
		})
		
}
/*
// Parallel walking
var walk = function(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) 
			return done(err);
		
		var i = 0;
		
		(function next() {
			var file = list[i++];
			var fileInfo = [];
			
			if (!file) 
				return done(null, results);
			
			fileInfo.path = dir + '/' + file;
			fileInfo.name = file;
			fileInfo.extension = getExtension(file);
			
			file = dir + '/' + file;
			
			
			fs.stat(fileInfo.path, function(err, stat) {
				if (stat && stat.isDirectory()) {
					fileInfo.type = "dir";
					results.push(fileInfo);
					walk(fileInfo.path, function(err, res) {
						results = results.concat(res);
						next();
					});
				} else {
					fileInfo.type = "file";
					fileInfo.stat = stat;
					results.push(fileInfo);
					next();
				}
			});
    	})();
	});
};

function getExtension(filename) {
    var i = filename.lastIndexOf('.');
    return (i < 0) ? '' : filename.substr(i);
}*/