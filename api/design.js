var ObjectID = require('mongodb').ObjectID;
var mongo = require('../lib/db').mongo;
var mock = require('./mock.js');

var PAGE_SIZE = 20;

function collection() {
  return mongo().collection('design')
}

exports.find = function(req, res, next) {
  //return res.send(mock.designList);
  // mock.designList.forEach(function(data){
  //   collection().save(data,function(){});
  // })

  var page = req.query.page || 1;
  var category = req.query.category;

  var query = category ? {
    category: category
  } : {};

  var limit = PAGE_SIZE
  var skip = (page - 1) * PAGE_SIZE;

  collection().find(query).sort({
    _id: -1
  }).limit(limit).skip(skip).toArray(function(err, results) {
    return res.send(results);
  });
}

exports.load = function(req, res, next) {
  collection().findOne({
    _id: new ObjectID(req.params.id)
  }, function(err, doc) {
    return res.send(doc);
  });
}

exports.save = function(req, res, next) {
  collection().save(req.body, function(err, doc) {
    return res.send(doc);
  });
}

exports.findCategory = function(req, res, next) {
  return res.send(mock.categoryList);
  collection().distinct('category', function(err, result) {
    return res.send(result);
  });
}

exports.list = function(req, res, next) {
  var ids = JSON.parse(req.query.ids).map(function(id){
    return new ObjectID(id);
  });
  collection().find({
    _id: {
      $in: ids
    }
  }).toArray(function(err, results) {
    return res.send(results);
  });
}