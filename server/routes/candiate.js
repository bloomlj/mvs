var mongodb = require('mongodb');
var db = require('../db');
/*
 * GET candiate page.
 */

exports.list = function(req, res){


    db.do('candiate',function(collection){
        collection.find({}).toArray(function(err, docs) {
        console.dir(docs);

        if (req.params.format == 'json') res.send({'docs' : docs});
        else res.render('candiate/list', {'docs' : docs});
      });
    });

  
};

exports.show = function(req, res){


    db.do('candiate',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.find({'_id' : new ObjectID(req.params.id)}).toArray(function(err, docs) {
        console.dir(docs[0]);
        res.render('candiate/show', docs[0]);
      });
    });

};

exports.add = function(req, res){
  pageinfo = {title:'MVS add a candiate.'};
  res.render('candiate/add', pageinfo);
};


exports.edit = function(req, res){

    db.do('candiate',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        console.dir(doc);
        res.render('candiate/edit', doc);
      });

    });

};


exports.create = function(req, res){

    db.do('candiate',function(collection){

              //insert
      var candiate = req.body;
      collection.insert(candiate, {safe:true}, function(err, objects) {
        if (err) console.warn(err.message);
        if (err && err.message.indexOf('E11000 ') !== -1) {
          // this _id was already inserted in the database

          res.render('candiate/add', {error:"该单位在系统中已经存在."});
        }
        res.redirect('/candiate');
      });
    });

 };


exports.update = function(req, res){

    db.do('candiate',function(collection){
      //find
       var ObjectID = require('mongodb').ObjectID;
        collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        var candiate = doc;
        console.dir(candiate);
        //insert
        candiate.name = req.body.name;
        candiate.note = req.body.note;

        collection.save(candiate,{safe:true}, function(err,object) {
             if (err) console.warn(err.message);
             else {console.log('successfully updated' + object);res.redirect('/candiate/');}
        });

      });

    });


};

exports.destroy = function(req, res){

    db.do('candiate',function(collection){
      var ObjectID = require('mongodb').ObjectID;
         // Remove all the document
      collection.remove({'_id' : new ObjectID(req.params.id)}, {safe:true}, function(err, numberOfRemovedDocs) {
        res.redirect('/candiate');
      });
    });

};



