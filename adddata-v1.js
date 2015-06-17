// vamos a hacer un programa en el que se le 
// añada una cantidad aleatoria a todos los artículos

var express = require('express');
var fs = require('fs');
var app = express(); // Web framework to handle routing requests
var MongoClient = require('mongodb').MongoClient; // Driver for connecting to MongoDB
var MONGOHQ_URL="mongodb://localhost:27017/plannerdb";
//var MONGOHQ_URL= 'mongodb://localhost:27017/aquodb';

MongoClient.connect(MONGOHQ_URL, function(err, db) {
    "use strict";
    if(err) throw err;

    var workers = db.collection("workers");

    function addWorkers (names) {
      workers.insert(names, function (err,res){
        if(err) throw err;
        console.log(res);
      });
    };

    function addEvents(events) {      
      for (var i = events.length - 1; i >= 0; i--) {
        var id = events[i].worker_id;
        var nombre = events[i].name;
        var evento = {"project":events[i].project,
                      "start":new Date (events[i].start),
                      "end":new Date (events[i].end),
                      "duration":events[i].duration};

        console.log(evento);
        
        // workers.findOne({name:nombre}, function (err,res){
        //   if (err) throw err;
        //   console.log (res);
        // });

        workers.update({name:nombre},{$push:{"events":evento}}, function (err,res){
          if(err) throw err;
          console.log(res);
        });
      };
    };

    var names = [{"name":"RAFA","acronym":"RAF","events":[]},
                 {"name":"JULIO","acronym":"JUL","events":[]},
                 {"name":"NAVARRO","acronym":"NAV","events":[]},
                 {"name":"JAVIER","acronym":"JAV","events":[]},
                 {"name":"STEFAN","acronym":"STE","events":[]},
                 {"name":"JUAN LUIS","acronym":"JUA","events":[]},
                 {"name":"CARLOS","acronym":"CAR","events":[]},
                 {"name":"ANTONIO","acronym":"ANT","events":[]},
                 {"name":"JOSE MANUEL","acronym":"JOS","events":[]},
                 {"name":"MIGUEL","acronym":"MIG","events":[]},
                 {"name":"VICTOR","acronym":"VIC","events":[]},
                 {"name":"PARDO","acronym":"PAR","events":[]},
                 {"name":"PABLO PASCUAL","acronym":"PAB","events":[]},
                 {"name":"JJ","acronym":"JJ","events":[]},
                 {"name":"GUALDA","acronym":"GUA","events":[]},
                 {"name":"SAOUMA","acronym":"SAO","events":[]},
                 {"name":"MOISES","acronym":"MOI","events":[]},
                 {"name":"FERNANDO","acronym":"FER","events":[]},
                 {"name":"COLIN","acronym":"COL","events":[]},
                 {"name":"MIKE","acronym":"MIK","events":[]},
                 {"name":"DONATE","acronym":"DON","events":[]},
                 {"name":"SERGIY","acronym":"SER","events":[]}];
    var events = [{"name":"RAFA","project":1,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"JULIO","project":2,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"NAVARRO","project":3,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"JAVIER","project":4,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"STEFAN","project":5,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"JUAN LUIS","project":6,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"CARLOS","project":7,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"ANTONIO","project":8,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"JOSE MANUEL","project":9,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"MIGUEL","project":10,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"VICTOR","project":11,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"PARDO","project":12,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"PABLO PASCUAL","project":13,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"JJ","project":14,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"GUALDA","project":15,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"SAOUMA","project":16,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"MOISES","project":17,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"FERNANDO","project":18,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"COLIN","project":19,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"MIKE","project":20,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"DONATE","project":21,"start":"August 6, 2015","end":"August 9, 2015","duration":4},
                  {"name":"SERGIY","project":22,"start":"August 6, 2015","end":"August 9, 2015","duration":4}]
    
    //addWorkers(names);
    addEvents(events);

});
