var MongoClient = require('mongodb').MongoClient

var mongo;

MongoClient.connect('mongodb://127.0.0.1:27017/novel-design', function(err, db) {
  if (err) throw err;
  mongo = db;
});

exports.mongo=function(){
  return mongo;  
}