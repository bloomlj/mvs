var mongodb = require('mongodb');
var db = require('../db');
/*
 * GET voter page.
 */

exports.list = function(req, res){


    db.do('voter',function(collection){
        collection.find({}).toArray(function(err, docs) {
        console.dir(docs);

        if (req.params.format == 'json') res.send({'docs' : docs});
        else res.render('voter/list', {'docs' : docs});
      });
    });

  
};

exports.show = function(req, res){


    db.do('voter',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.find({'_id' : new ObjectID(req.params.id)}).toArray(function(err, docs) {
        console.dir(docs[0]);
        res.render('voter/show', docs[0]);
      });
    });

};

exports.add = function(req, res){

      db.do('vote',function(collection){
        collection.find({}).toArray(function(err, docs) {
        console.dir(docs);
        res.render('voter/add', {"votes":docs});
       
      });
    });


};


exports.edit = function(req, res){

    db.do('voter',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        console.dir(doc);
        res.render('voter/edit', doc);
      });

    });

};


exports.create = function(req, res){

    db.do('voter',function(collection){

              //insert
      var voter = req.body;
      collection.insert(voter, {safe:true}, function(err, objects) {
        if (err) console.warn(err.message);
        if (err && err.message.indexOf('E11000 ') !== -1) {
          // this _id was already inserted in the database

          res.render('voter/add', {error:"该单位在系统中已经存在."});
        }
        res.redirect('/voter');
      });
    });

 };


exports.update = function(req, res){

    db.do('voter',function(collection){
      //find
       var ObjectID = require('mongodb').ObjectID;
        collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        var voter = doc;
        console.dir(voter);
        //insert
        voter.name = req.body.name;
        voter.note = req.body.note;

        collection.save(voter,{safe:true}, function(err,object) {
             if (err) console.warn(err.message);
             else {console.log('successfully updated' + object);res.redirect('/voter/');}
        });

      });

    });


};

exports.destroy = function(req, res){

    db.do('voter',function(collection){
      var ObjectID = require('mongodb').ObjectID;
         // Remove all the document
      collection.remove({'_id' : new ObjectID(req.params.id)}, {safe:true}, function(err, numberOfRemovedDocs) {
        res.redirect('/voter');
      });
    });

};



