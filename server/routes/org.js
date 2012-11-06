var mongodb = require('mongodb');
var db = require('../db');
/*
 * GET org page.
 */

exports.list = function(req, res){


    db.do('orgs',function(collection){
        collection.find({}).toArray(function(err, docs) {
        console.dir(docs);

        if (req.params.format == 'json') res.send({'docs' : docs});
        else res.render('org/list', {'docs' : docs});
      });
    });

  
};

exports.show = function(req, res){


    db.do('orgs',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.find({'_id' : new ObjectID(req.params.id)}).toArray(function(err, docs) {
        console.dir(docs[0]);
        res.render('org/show', docs[0]);
      });
    });

};

exports.add = function(req, res){
  pageinfo = {title:'MVS add a org.'};
  res.render('org/add', pageinfo);
};


exports.edit = function(req, res){

    db.do('orgs',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        console.dir(doc);
        res.render('org/edit', doc);
      });

    });

};


exports.create = function(req, res){

    db.do('orgs',function(collection){

              //insert
      var org = req.body;
      collection.insert(org, {safe:true}, function(err, objects) {
        if (err) console.warn(err.message);
        if (err && err.message.indexOf('E11000 ') !== -1) {
          // this _id was already inserted in the database

          res.render('org/add', {error:"该单位在系统中已经存在."});
        }
        res.redirect('/org');
      });
    });

 };


exports.update = function(req, res){

    db.do('orgs',function(collection){
      //find
       var ObjectID = require('mongodb').ObjectID;
        collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        var org = doc;
        console.dir(org);
        //insert
        org.name = req.body.name;
        org.note = req.body.note;

        collection.save(org,{safe:true}, function(err,object) {
             if (err) console.warn(err.message);
             else {console.log('successfully updated' + object);res.redirect('/org/');}
        });

      });

    });


};

exports.destroy = function(req, res){

    db.do('orgs',function(collection){
      var ObjectID = require('mongodb').ObjectID;
         // Remove all the document
      collection.remove({'_id' : new ObjectID(req.params.id)}, {safe:true}, function(err, numberOfRemovedDocs) {
        res.redirect('/org');
      });
    });

};



