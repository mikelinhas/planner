var mongo  = require("mongodb");
//var log    = require("./utilities").log;
var n      = "[ mongo.js] ";
var Server = mongo.Server;
var Db     = mongo.Db;
var BSON   = mongo.BSONPure;
var MongoClient = mongo.MongoClient;
// var MONGOHQ_URL= 'mongodb://localhost:27017/plannerdb';
var MONGOHQ_URL= 'mongodb://mike:whatsyouproblem@ds011419.mlab.com:11419/heroku_057nwfj0'

var db;

// Init
    exports.init = function(cb){
            //db.open(cb);
            console.log("connecting to MongoDB...");
            MongoClient.connect(MONGOHQ_URL, 
                // {server: {
                //     auto_reconnect: true,
                //     socketOptions: {
                //         connectTimeoutMS: 3000,
                //         socketTimeoutMS:  3000,
                //         keepAlive:        3000
                //     }
                // }}, 
                function(err, dbinstance) {
                    if (err){
                        //log(err);
                        cb(err,0);
                    } else {
                        db = dbinstance;
                        cb(0,dbinstance);
                    }
            });
    };


// Pass collection to model for a custom operation
    exports.getCollection = function(collectionName, cb){
        db.collection(collectionName, cb);
    };

    exports.pushEvent = function(collectionName, id, data, cb){  //same as insert
            db.collection(collectionName, function(err, collection) {
                collection.update({'_id':id}, {$push: {'events': data}}, cb);
            });
    };

// Generic
    exports.findWorkers = function(collectionName, cb){
        db.collection(collectionName, function(err, collection) {
            collection.find({},{}).toArray(cb);
        });
    };

    exports.aggregateWorkers = function(collectionName, cb){
        db.collection(collectionName, function(err, collection) {
            collection.aggregate([
                        {$unwind: "$events"},
                        {$sort: {'skill':1, 'events.start':1}},
                        {$group: {
                            _id: {worker_id:"$_id", name: "$name", acronym: "$acronym"},
                            events: {$push: "$events"}
                            }
                        }], cb)
        });
    };

    exports.findEvent = function(collectionName, date, worker, cb){
        db.collection(collectionName, function(err, collection) {
            collection.find({'start': date, 'worker_id': worker},{}).toArray(cb);
        });
    };
    exports.findAll = function(collectionName, cb){
        db.collection(collectionName, function(err, collection) {
            collection.find({},{}).toArray(cb);
        });
    };
    exports.findAllfiltered = function(query, cb){
        db.collection(collectionName, function(err, collection) {
            collection.find({},{}).toArray(cb);
        });
    };
    exports.findById = function(collectionName, id, cb){
        db.collection(collectionName, function(err, collection) {
            collection.findOne({'_id':new BSON.ObjectID(id)}, cb );
        });
    };
    exports.create = function(collectionName, data, cb){  //same as insert
            data.createdAt = new Date();
            db.collection(collectionName, function(err, collection) {
                collection.insert(data, {safe:true}, cb);
            });
    };
    exports.update = function(collectionName, id, data, cb){  //same as insert
            if (data._id)
                delete data._id;
            data.updatedAt = new Date();
            db.collection(collectionName, function(err, collection) {
                collection.update({'_id':new BSON.ObjectID(id)}, data, {safe:true, upsert:false}, cb);
            });
    };
    exports.delete = function(collectionName, id, cb){
        db.collection(collectionName, function(err, collection) {
            collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, cb);
        });
    };

    exports.deleteall = function(collectionName, cb){
        db.collection(collectionName, function(err, collection) {
            collection.remove({}, cb);
        });
    };


