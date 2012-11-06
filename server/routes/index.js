var mongodb = require('mongodb');
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('wwwindex', { title: 'MVS' });
};