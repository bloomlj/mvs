var mongodb = require('mongodb');
var db = require('../db');
/*
 * GET report page.
 */

exports.list = function(req, res){


    db.do('report',function(collection){
        collection.find({}).toArray(function(err, docs) {
        console.dir(docs);

        if (req.params.format == 'json') res.send({'docs' : docs});
        else res.render('report/list', {'docs' : docs});
      });
    });

  
};

exports.show = function(req, res){

  db.do('report',function(collection){
    var ObjectID = require('mongodb').ObjectID;
    collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, report){
      db.do('answer',function(collection){
        collection.find({"vote_id":report['vote_id']}).toArray(function(err, answers) {
          //report.answers = answers;
          db.do('vote',function(collection){
            var ObjectID = require('mongodb').ObjectID;
            collection.findOne({'_id' : new ObjectID(report.vote_id)},function(err, vote) {
              report.vote = vote;
              report.reportbody = {"sections":{}};
              
              for(answerindex in answers){
                for(section_key in answers[answerindex]['answer']){
                  for(group_key in answers[answerindex]['answer'][section_key]){
                    for(org_key in answers[answerindex]['answer'][section_key][group_key]){
                      for(question_key in answers[answerindex]['answer'][section_key][group_key][org_key]){
                        for(subquestion_key in answers[answerindex]['answer'][section_key][group_key][org_key][question_key]){
                          if(typeof report.reportbody['sections'][section_key] == "undefined") report.reportbody['sections'][section_key] = {'groups':{}};
                          if(typeof report.reportbody['sections'][section_key]['groups'][group_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key] = {"orgs":{}};
                          if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key] = {'questions':{}};
                          if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key] = {'subquestions':{}};
                          if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key] = {"all":0,"count":0,"avg":0,"largest":0,"minist":100};
                          var thisvalue = parseInt(answers[answerindex]['answer'][section_key][group_key][org_key][question_key][subquestion_key]);
                          
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['all']+= thisvalue;
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['count']++;
                          if(report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['largest'] < thisvalue){
                            report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['largest'] = thisvalue;
                          }
                          if(report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['minist'] > thisvalue){
                            report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['minist'] = thisvalue;
                          }                      
                          report.reportbody['sections'][section_key]['title'] = vote['sections'][section_key]['title'];
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['title'] = vote['sections'][section_key]['groups'][group_key]['orgs'][org_key]['fullname'];
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['title'] = vote['sections'][section_key]['groups'][group_key]['questions'][question_key]['text'];
                          if(subquestion_key=='total_0') report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['title'] = '总计';
                          else report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['title'] = vote['sections'][section_key]['groups'][group_key]['questions'][question_key]['subquestions'][subquestion_key]['text'];
                          console.log(vote['sections'][section_key]['groups'][group_key]['questions'][question_key]['subquestions'][subquestion_key]);
                        }
                      }
                    }
                  }
                }
              }
              //give the  undefine field a  NaN value.
              for(section_key in vote.sections){
                for(group_key in vote.sections[section_key]['groups']){
                  for(org_key in vote.sections[section_key]['groups'][group_key]['orgs']){
                    if(typeof vote.sections[section_key]['groups'][group_key]['orgs'][org_key]['fullname'] != "undefined"){
                      console.log(vote.sections[section_key]['groups'][group_key]['orgs'][org_key]['fullname']);
                      for(question_key in vote.sections[section_key]['groups'][group_key]['questions']){
                        if(typeof report.reportbody['sections'][section_key] == "undefined") report.reportbody['sections'][section_key] = {'groups':{}};
                        if(typeof report.reportbody['sections'][section_key]['groups'][group_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key] = {"orgs":{}};
                        if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key] = {'questions':{}};
                        if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key] = {'subquestions':{}};
                        if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key] == "undefined") {
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key] = {"all":"N"};
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions']['total_0'] = {"all":"N"};
                        }

                      }
                    }

                  }
                }
              }

              if (req.params.format == 'json') { res.set('Access-Control-Allow-Origin', '*');res.send(report);}
              else res.render('report/show', report);
            });
          });

        });
      });
      //answer get end
    });
  });

};


exports.api_opening = function(req, res){
    var password = req.params.password;

    //first check login ,then send data
    db.do('voter',function(collection){
      collection.findOne({'password':password},function(err, voterdoc){
        console.dir(voterdoc);
        if(!voterdoc){
          res.set('Access-Control-Allow-Origin', '*');
          res.send({'status':'error','info':'错误的用户名和密码。'});
        }else{
          var voteid = voterdoc.vote_id
          var ObjectID = require('mongodb').ObjectID;

      db.do('answer',function(collection){
        collection.find({"vote_id":voteid}).toArray(function(err, answers) {
          //report.answers = answers;
          db.do('vote',function(collection){
            var ObjectID = require('mongodb').ObjectID;
            collection.findOne({'_id' : new ObjectID(voteid)},function(err, vote) {
              report = {};
              report.vote = vote;
              report.reportbody = {"sections":{}};
              for(answerindex in answers){
                for(section_key in answers[answerindex]['answer']){
                  for(group_key in answers[answerindex]['answer'][section_key]){
                    for(org_key in answers[answerindex]['answer'][section_key][group_key]){
                      for(question_key in answers[answerindex]['answer'][section_key][group_key][org_key]){
                        for(subquestion_key in answers[answerindex]['answer'][section_key][group_key][org_key][question_key]){
                          if(typeof report.reportbody['sections'][section_key] == "undefined") report.reportbody['sections'][section_key] = {'groups':{}};
                          if(typeof report.reportbody['sections'][section_key]['groups'][group_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key] = {"orgs":{}};
                          if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key] = {'questions':{}};
                          if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key] = {'subquestions':{}};
                          if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key] = {"all":0,"count":0,"avg":0,"largest":0,"minist":100};
                          var thisvalue = parseInt(answers[answerindex]['answer'][section_key][group_key][org_key][question_key][subquestion_key]);
                          
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['all']+= thisvalue;
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['count']++;
                          if(report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['largest'] < thisvalue){
                            report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['largest'] = thisvalue;
                          }
                          if(report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['minist'] > thisvalue){
                            report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['minist'] = thisvalue;
                          }

                          report.reportbody['sections'][section_key]['title'] = vote['sections'][section_key]['title'];
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['title'] = vote['sections'][section_key]['groups'][group_key]['orgs'][org_key]['fullname'];
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['title'] = vote['sections'][section_key]['groups'][group_key]['questions'][question_key]['text'];
                          if(subquestion_key=='total_0') report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['title'] = '总计';
                          else report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key]['title'] = vote['sections'][section_key]['groups'][group_key]['questions'][question_key]['subquestions'][subquestion_key]['text'];
                          console.log(vote['sections'][section_key]['groups'][group_key]['questions'][question_key]['subquestions'][subquestion_key]);
                        }
                      }
                    }
                  }
                }
              }
              //give the  undefine field a  NaN value.
              for(section_key in vote.sections){
                for(group_key in vote.sections[section_key]['groups']){
                  for(org_key in vote.sections[section_key]['groups'][group_key]['orgs']){
                    if(typeof vote.sections[section_key]['groups'][group_key]['orgs'][org_key]['fullname'] != "undefined"){
                      console.log(vote.sections[section_key]['groups'][group_key]['orgs'][org_key]['fullname']);
                      for(question_key in vote.sections[section_key]['groups'][group_key]['questions']){
                        if(typeof report.reportbody['sections'][section_key] == "undefined") report.reportbody['sections'][section_key] = {'groups':{}};
                        if(typeof report.reportbody['sections'][section_key]['groups'][group_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key] = {"orgs":{}};
                        if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key] = {'questions':{}};
                        if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key] == "undefined") report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key] = {'subquestions':{}};
                        if(typeof report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key] == "undefined") {
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions'][subquestion_key] = {"all":"N"};
                          report.reportbody['sections'][section_key]['groups'][group_key]['orgs'][org_key]['questions'][question_key]['subquestions']['total_0'] = {"all":"N"};
                        }

                      }
                    }

                  }
                }
              }
               report.status = 'success';
               res.set('Access-Control-Allow-Origin', '*');
               res.send(report);

            });
          });

        });
      });
      //answer get end

        }

      });
    });

}


exports.add = function(req, res){
  db.do('vote',function(collection){
      collection.find({}).toArray(function(err, docs) {
      console.dir(docs);
      res.render('report/add', {"votes":docs});
     
    });
  });
};


exports.edit = function(req, res){

    db.do('report',function(collection){
      var ObjectID = require('mongodb').ObjectID;
      collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        console.dir(doc);
        res.render('report/edit', doc);
      });

    });

};


exports.create = function(req, res){

    db.do('report',function(collection){

              //insert
      var report = req.body;
      collection.insert(report, {safe:true}, function(err, objects) {
        if (err) console.warn(err.message);
        if (err && err.message.indexOf('E11000 ') !== -1) {
          // this _id was already inserted in the database

          res.render('report/add', {error:"该单位在系统中已经存在."});
        }
        res.redirect('/report');
      });
    });

 };


exports.api_create = function(req, res){

    db.do('report',function(collection){
       //insert
      var report = req.body;
      report.ip = req.ip;
      report.submittime = new Date();;
      
      collection.insert(report, {safe:true}, function(err, objects) {
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

    db.do('report',function(collection){
      //find
       var ObjectID = require('mongodb').ObjectID;
        collection.findOne({'_id' : new ObjectID(req.params.id)},function(err, doc) {
        var report = doc;
        console.dir(report);
        //insert
        report.name = req.body.name;
        report.note = req.body.note;

        collection.save(report,{safe:true}, function(err,object) {
             if (err) console.warn(err.message);
             else {console.log('successfully updated' + object);res.redirect('/report/');}
        });

      });

    });


};

exports.destroy = function(req, res){

    db.do('report',function(collection){
      var ObjectID = require('mongodb').ObjectID;
         // Remove all the document
      collection.remove({'_id' : new ObjectID(req.params.id)}, {safe:true}, function(err, numberOfRemovedDocs) {
        res.redirect('/report');
      });
    });

};



