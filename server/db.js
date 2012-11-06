var mongodb = require('mongodb');
var db_server = "127.0.0.1";
var db_port = 27017;
var db_name = 'mvs';
exports.do = function(table,callback){
    var server = new mongodb.Server(db_server, db_port, {});

    new mongodb.Db(db_name, server, {}).open(function (error, client) {
      if (error) throw error;
      var collection = new mongodb.Collection(client, table);
	  callback(collection);
    });

};
// var pg = require('pg'); //native libpq bindings = `var pg = require('pg').native`
// var conString = "tcp://postgres:karakal@localhost/postgres";
// //var client = new pg.Client(conString);
// exports.client = new pg.Client(conString);