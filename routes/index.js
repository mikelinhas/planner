//Routing files
var views = require('./views');
var data = require('../database/data');

module.exports = exports = function(app, db) {


	 //To get rid of the favicon.ico error
	app.get('/favicon.ico', views.faviconerror);


	// Render the different views for the different apps
	app.get('/settings', views.settings);
	app.get('/', views.home);



	// // Load / Update / Delete stuff with mongo
	app.get('/rest/data', data.getWorkers);
	app.post('/rest/data/addEvent', data.addEvent);
	app.post('/rest/data/importWorkers', data.importWorkers);
	app.post('/rest/data/importEvents', data.importEvents);
	// app.get('/rest/article_id', data.getOnearticle);


	// // Posts
	// app.post('/rest/data/add', data.addarticle);

	// // Delete
	// app.delete('/rest/data/delete', data.delete);

	// // redirect all others to the index
	// app.get('*', views.home); //no funciona
}