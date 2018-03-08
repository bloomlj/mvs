const mongo_client = require('mongodb').MongoClient;
const assert = require('assert');

//connect url
const url = 'mongodb://localhost:27017';
//db name
const db_name = 'mvs'


exports.do = function(table,callback){
    mongo_client.connect(url,function (error, client) {
      if (error) throw error;
      const db = client.db(db_name);
      const collection = db.collection(client, table);
	  callback(collection);
    });

};
// var pg = require('pg'); //native libpq bindings = `var pg = require('pg').native`
// var conString = "tcp://postgres:karakal@localhost/postgres";
// //var client = new pg.Client(conString);
// exports.client = new pg.Client(conString);
