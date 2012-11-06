var mongodb = require('mongodb');
var db = require('../db');
/*
 * GET bullot page.
 */

exports.list = function(req, res){


    db.do('bullot',function(collection){
        collection.find({}).toArray(function(err, docs) {
        console.dir(docs);

        if (req.params.format == 'json') res.send({'docs' : docs});
        else res.render('bullot/list', {'docs' : docs});
      });
    });
 
};

exports.show = function(req, res){

    db.do('bullot',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.find({'_id' : new ObjectID(req.params.id)}).toArray(function(err, docs) {
        console.dir(docs[0]);
        res.render('bullot/show', docs[0]);
      });
    });

};

exports.add = function(req, res){
  res.render('bullot/add', {'vote_id':req.params.vote_id});
};


exports.edit = function(req, res){

    db.do('bullot',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        console.dir(doc);
        res.render('bullot/edit', doc);
      });

    });

};


exports.create = function(req, res){

    db.do('bullot',function(collection){

              //insert
      var bullot = req.body;
      collection.insert(bullot, {safe:true}, function(err, objects) {
        if (err) console.warn(err.message);
        if (err && err.message.indexOf('E11000 ') !== -1) {
          // this _id was already inserted in the database

          res.render('bullot/add', {error:"该单位在系统中已经存在."});
        }
        res.redirect('/bullot');
      });
    });

 };


exports.update = function(req, res){

    db.do('bullot',function(collection){
      //find
       var ObjectID = require('mongodb').ObjectID;
        collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        var bullot = doc;
        console.dir(bullot);
        //insert
        bullot.name = req.body.name;
        bullot.note = req.body.note;

        collection.save(bullot,{safe:true}, function(err,object) {
             if (err) console.warn(err.message);
             else {console.log('successfully updated' + object);res.redirect('/bullot/');}
        });

      });

    });


};

exports.destroy = function(req, res){

    db.do('bullot',function(collection){
      var ObjectID = require('mongodb').ObjectID;
         // Remove all the document
      collection.remove({'_id' : new ObjectID(req.params.id)}, {safe:true}, function(err, numberOfRemovedDocs) {
        res.redirect('/bullot');
      });
    });

};



