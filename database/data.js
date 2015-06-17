var mongodb = require('./mongo')

// GET
    
    exports.getWorkers = function (req,res) {
        var collectionName = "workers";
        var dates = [];
        mongodb.aggregateWorkers(collectionName, function (err,result) {
            if (err){
                console.log(err);
                res.status(500).send({});
            } else {
                res.status(200).send(result);
            }
        });
    }
    
    exports.getEvent = function (req,res) {
        var collectionName = "events";
        var date = new Date(req.query.date);
        console.log(date);
        var worker = req.query.worker;
        console.log(worker);
        mongodb.findEvent(collectionName, date, worker, function (err,result) {
            if (err){
                console.log(err);
                res.status(500).send({});
            } else {
                res.status(200).send(result);
            }
        });
    }

	exports.getOnearticle = function (req,res) {
		var collectionName = "articles";
		var id = req.query.id;
		console.log(id);
		mongodb.findById(collectionName, id, function (err,result) {
			if (err){
				console.log(err);
				res.status(500).send({});
			} else {
				res.status(200).send(result);
			}
		});
	}


// POST

exports.addEvent = function(req, res) {
    var date = new Date();
    console.log (date);
    var worker_id = req.body.worker_id;
    var evento = req.body.evento;
    console.log(evento);
    console.log(worker_id);

    // mongodb.create('articles', article, function (err, result) {
    // 	if (err) {
    // 		console.log (err);
    // 		res.status(500).send({});
    // 	} else {
    // 		var _id = result[0]._id;
    // 		console.log ("article was added to mongodb.. check it out");
    // 	}
    // });

};

exports.importWorkers = function(req, res) {
    var data = req.body.data;
    console.log(data);

    mongodb.create('workers', data, function (err, result) {
    	if (err) {
    		console.log (err);
    		res.status(500).send({});
    	} else {
    		res.status(200).send({});
    		console.log ("import was successful.. check it out");
    	}
    });

};

exports.importEvents2 = function(req, res) {
    var data = req.body.data;
    // while (updated + errors < data.length) {
    for (var i = data.length - 1; i >= 0; i--) {
        var evento = {'worker_id': data[i].worker_id,
                      'project': data[i].project,
                      'start': new Date(data[i].start),
                      'end': new Date(data[i].end),
                      'duration': data[i].duration};

        setTimeout(push (evento), 3000);

    };

    function push (evento) {
        console.log(evento);            
        mongodb.create('events', evento, function (err,result){
            if (err) {
                console.log (err);
                //errors ++;
            } else {
                console.log (result);
                //updated ++;
                //console.log(updated);
            }
        })
    }
    //};

    res.status(200).send({});

};

exports.importEvents = function(req, res) {
    var data = req.body.data;
    var updated = 0;
    var errors = 0;
    // while (updated + errors < data.length) {
    for (var i = data.length - 1; i >= 0; i--) {
    	var id = data[i].worker_id;
    	var evento = {'project': data[i].project,
    				  'start': data[i].start,
    				  'end': data[i].end};

    	setTimeout(push (id,evento), 3000);

    };

    function push (id,evento) {
		console.log(id);
		console.log(evento);    		
    	mongodb.pushEvent('workers', id, evento, function (err,result){
    		if (err) {
    			console.log (err);
    			errors ++;
    		} else {
    			console.log (result);
    			updated ++;
    			console.log(updated);
    		}
    	})
    }
    //};

    res.status(200).send({});

};

// DELETE

exports.delete = function (req, res) {
	console.log (req.body);
	var id = req.body.id;
	mongodb.delete ("articles", id, function (err,result) {
		if (err){
			console.log(err);
    		res.status(500).send({});
		} else {
			console.log(id + "was deleted from the mongoDB");
    		res.status(200).send({});
		}
	});
};

/*  

[0:07:35] Marios Georgiou: your middleware.js should look like

exports.findAll = function(req,res){
    log(n+"Returning all");
    model.siteFindAll('Rules', req.user.linkedDevices, function(err, result){
        if (err){
            log(err);
            res.send(500, {});
        } else {
            res.send(200, result);
        }
    });
    //res.end();
};

*/