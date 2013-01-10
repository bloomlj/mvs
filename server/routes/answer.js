var mongodb = require('mongodb');
var db = require('../db');
/*
 * GET answer page.
 */

exports.list = function(req, res){


    db.do('answer',function(collection){
        collection.find({}).toArray(function(err, docs) {
        console.dir(docs);

        if (req.params.format == 'json') res.send({'docs' : docs});
        else res.render('answer/list', {'docs' : docs});
      });
    });

  
};

exports.show = function(req, res){


    db.do('answer',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.find({'_id' : new ObjectID(req.params.id)}).toArray(function(err, docs) {
        console.dir(docs[0]);
        res.render('answer/show', docs[0]);
      });
    });

};

exports.add = function(req, res){
  res.render('answer/add', {});
};


exports.edit = function(req, res){

    db.do('answer',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        console.dir(doc);
        res.render('answer/edit', doc);
      });

    });

};


exports.create = function(req, res){

    db.do('answer',function(collection){

              //insert
      var answer = req.body;
      collection.insert(answer, {safe:true}, function(err, objects) {
        if (err) console.warn(err.message);
        if (err && err.message.indexOf('E11000 ') !== -1) {
          // this _id was already inserted in the database

          res.render('answer/add', {error:"该单位在系统中已经存在."});
        }
        res.redirect('/answer');
      });
    });

 };


exports.api_create = function(req, res){

    db.do('answer',function(collection){
       //insert
      var answer = req.body;
      answer.ip = req.ip;
      answer.submittime = new Date();
      
      collection.insert(answer, {safe:true}, function(err, objects) {
        if (err){
          console.warn(err.message);
        }
        else{
          res.set('Access-Control-Allow-Origin', '*');
          res.send({status:"您的数据已提交，并已存入数据库。"});
        }
        
      });
    });

 };

exports.update = function(req, res){

    db.do('answer',function(collection){
      //find
       var ObjectID = require('mongodb').ObjectID;
        collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        var answer = doc;
        console.dir(answer);
        //insert
        answer.name = req.body.name;
        answer.note = req.body.note;

        collection.save(answer,{safe:true}, function(err,object) {
             if (err) console.warn(err.message);
             else {console.log('successfully updated' + object);res.redirect('/answer/');}
        });

      });

    });


};

exports.destroy = function(req, res){

    db.do('answer',function(collection){
      var ObjectID = require('mongodb').ObjectID;
         // Remove all the document
      collection.remove({'_id' : new ObjectID(req.params.id)}, {safe:true}, function(err, numberOfRemovedDocs) {
        res.redirect('/answer');
      });
    });

};



