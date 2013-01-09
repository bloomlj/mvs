var mongodb = require('mongodb');
var db = require('../db');
var _ = require('underscore');
/*
 * GET votevote page.
 */

exports.list = function(req, res){


    db.do('vote',function(collection){
        collection.find({}).toArray(function(err, docs) {
        console.dir(docs);

        if (req.params.format == 'json') res.send({'docs' : docs});
        else res.render('vote/list', {'docs' : docs});
       
      });
    });
}


exports.show = function(req, res){

    db.do('vote',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc){
        console.dir(doc);
        if (req.params.format == 'json') { res.set('Access-Control-Allow-Origin', '*');res.send(doc);}
        else res.render('vote/show', doc);
      });
    });
}


exports.result = function(req, res){
  var renderdata = {};
    db.do('vote',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, vote){
        console.dir(vote);
        renderdata.vote = vote;

        db.do('answer',function(collection){
        collection.find({'vote_id' : req.params.id}).toArray(function(err, docs) {
        console.dir(docs);


        var result = {};
        if("mark" == vote.vtype){
          //process mark
          for (var i = 0; i < docs.length; i++) {
            for (var org in docs[i].answer) {
              result[org] = {};
              for(var question in docs[i].answer[org]){
                result[org][question] = {};
                result[org][question].votevalue_array = new Array();
                result[org][question].votevalue_array.push(docs[i].answer[org][question].markvalue);
                //console.dir(result.answer[org][question].markvalue);
                //console.dir(docs[i].answer[org][question].markvalue);
              }
            }
          }


          for (var org in result) {
            for(var question in result[org]){
              var total = 0;
              var len = result[org][question].votevalue_array.length;
              for (var x = 0; x < len; x++) {
                total+=parseInt(result[org][question].votevalue_array[x]);
              };

              result[org][question].avg = total/len;
              //console.dir(result.answer[org][question].result);
            }  
          }

        }

        
        if("vote" == vote.vtype){
          //process  vote
          for (var i = 0; i < docs.length; i++) {
            for (var org in docs[i].answer) {
              console.dir(org);
              result[org] = {};
              for (var candidate in docs[i].answer[org]) {
                console.dir(candidate);
                result[org][candidate] = {};
                result[org][candidate].votevalue_array = new Array();
                result[org][candidate].votevalue_array.push(docs[i].answer[org][candidate].votevalue);
              }
            }
          }

          for (var org in result) {
            for (var candidate in result[org]) {
              var total = 0;
              var len = result[org][candidate].votevalue_array.length;
              for (var x = 0; x < len; x++) {
                total+=parseInt(result[org][candidate].votevalue_array[x]);
              };

              result[org][candidate].total = total;
              //console.dir(result.answer[org][question].result);
            }
          }

        }


        console.dir(result);
        renderdata.result = result;

        if (req.params.format == 'json') res.send(renderdata);
        else res.render('vote/result', renderdata);
       
        });
        });

      });
    });

    
}


exports.api_opened = function(req, res){
    var password = req.params.password;

    //first check login ,then send data
    db.do('voter',function(collection){
      collection.findOne({'password':password},function(err, voterdoc){
        console.dir(voterdoc);
        if(!voterdoc){
          res.set('Access-Control-Allow-Origin', '*');
          res.send({'status':'error','info':'错误的密码。'});
        }else{
          var ObjectID = require('mongodb').ObjectID;
          db.do('vote',function(collection){
            collection.findOne({'_id' : new ObjectID(voterdoc.vote_id)},function(err, votedoc){
              if(!votedoc){
                res.set('Access-Control-Allow-Origin', '*');
                res.send({'status':'error','info':'密码已过期。'});
              }else{
                votedoc.role = voterdoc.role;
                console.dir(votedoc);
                res.set('Access-Control-Allow-Origin', '*');
                res.send({'status':'success','info':'通过验证','data':votedoc});
              }
              
             

            });
          });
        }

      });
    });


}


exports.add = function(req, res){
  //pageinfo = {title:'MVS add a vote.'};
  var vote = {}; 
  vote.votedata = {name:"",vtype:"",note:"",sections:[],isopen:'no'};
  vote.votedata = {name:"",vtype:"",note:"",sections:[],isopen:'no'};
  vote.votedata.sections.push({title:"",subtitle:"",groups:[]});
  vote.votedata.sections[0].groups.push({title:"",max:"",min:"",candidates:[],questions:[],orgs:[]});
  vote.votedata.sections[0].groups[0].candidates.push({org:"",name:""});
  vote.votedata.sections[0].groups[0].questions.push({text:"",weight:"",subquestions:[]});
  vote.votedata.sections[0].groups[0].questions[0].subquestions.push({text:"",weight:""});
  vote.votedata.sections[0].groups[0].orgs.push({fullname:"",code:""});

    //get orgs
    db.do('orgs',function(collection){
        collection.find({}).toArray(function(err, docs) {
        console.dir(docs);
        vote.allorgs = docs;
        res.render('vote/add', vote);
      });
    });

};

exports.addvote = function(req, res){
  var vote = {}; 
  res.render('vote/add_vote', vote);
};

exports.addmark = function(req, res){
  var vote = {}; 
    //get orgs
    db.do('orgs',function(collection){
        collection.find({}).toArray(function(err, docs) {
        console.dir(docs);
        vote.allorgs = docs;
        res.render('vote/add_mark', vote);
      });
    });

};

exports.edit = function(req, res){
  var vote = {}; 
    db.do('vote',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc){
        console.dir(doc);
        vote.votedata = doc;
        //get orgs
        db.do('orgs',function(collection){
          collection.find({}).toArray(function(err, orgs) {
            vote.allorgs = orgs;
            res.render('vote/edit', vote);
          });
        });

      });

    });
}

exports.create = function(req, res){

    db.do('vote',function(collection){
      //insert
      var vote = req.body;
       //default values
      vote.updated_date = new Date();
      //vote.open = 'N';
      //sortVote(vote);
      collection.insert(vote, {safe:true}, function(err, docs) {
        if (err) console.warn(err.message);
        if (err && err.message.indexOf('E11000 ') !== -1) {
          // this _id was already inserted in the database
        }
        res.redirect('/vote');
        //res.redirect('/vote/'+docs[0]._id+'/addtargets');
      });
    });

}


exports.update = function(req, res){    
    db.do('vote',function(collection){

      var ObjectID = require('mongodb').ObjectID;
      collection.update({_id: new ObjectID(req.params.id)}, {$set: req.body}, {safe:true},
        function(err) {
          if (err) console.warn(err.message);
          else {
            console.log('successfully updated'); 
            res.redirect('/vote/');
          }
      });

    });

}


exports.open = function(req, res){


    db.do('vote',function(collection){
      collection.update({}, {$set: {"isopen":"no"}}, {safe:true},
        function(err) {
          if (err) console.warn(err.message);
          else {
            //这里有必要先把别的vote停掉，然后再开启这一个。
              db.do('vote',function(collection){
                var ObjectID = require('mongodb').ObjectID;
                collection.update({_id: new ObjectID(req.params.id)}, {$set: {"isopen":"yes"}}, {safe:false},
                  function(err) {
                    if (err) console.warn(err.message);
                    else {
                      console.log('successfully updated'); 
                      res.redirect('/vote/');
                    }
                });

              });
          }
      });

    });


}

exports.clone = function(req, res){

    db.do('vote',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc){
        console.dir(doc);
        var newdoc = doc;
        newdoc._id = null;
        newdoc.clone_from = doc._id;
        newdoc.name = newdoc.name + "-副本";
        collection.insert(newdoc, {safe: true}, function(err, records){
            console.log("copy newdoc record: "+records[0]._id);
            res.redirect('/vote/');
        });
      });

    });
}


exports.stop = function(req, res){

    db.do('vote',function(collection){

      var ObjectID = require('mongodb').ObjectID;
      collection.update({_id: new ObjectID(req.params.id)}, {$set: {"isopen":"no"}}, {safe:true},
        function(err) {
          if (err) console.warn(err.message);
          else {
            console.log('successfully updated'); 
            res.redirect('/vote/');
          }
      });

    });

}


exports.destroy = function(req, res){

    db.do('vote',function(collection){
      var ObjectID = require('mongodb').ObjectID;
         // Remove all the document
      collection.remove({'_id' : new ObjectID(req.params.id)}, {safe:true}, function(err, numberOfRemovedDocs) {
        res.redirect('/vote');
      });
    });

};


var sortFn_byorder = function(a, b){
  if (a.order < b.order) return -1;
  if (a.order > b.order) return 1;
  if (a.order == b.order) return 0;
}

var sortVote = function(votedoc){
  votedoc.sections.forEach(function(section) {
    section.groups.forEach(function(group){
      group.candidates.sort(sortFn_byorder);
      group.orgs.sort(sortFn_byorder);
    });
  });
}