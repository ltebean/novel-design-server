var ObjectID = require('mongodb').ObjectID;
var mongo = require('../lib/db').mongo;

var PAGE_SIZE = 20;

function collection() {
  return mongo().collection('design')
}

var mockData = [{
    title: 'best design',
    description: '非常精美别致的厨房设计，有设计大师Kindlie设计',
    pics: ['http://p4.zbjimg.com/task/2011-08/17/968741/4e4b1606b89d3.jpg']
  }, {
    title: 'House',
    description: '非常精美别致',
    pics: ['http://img1.gtimg.com/hb/pics/hv1/97/119/823/53546017.jpg']
  }, {
    title: 'best design',
    description: '非常精美别致的厨房设计，有设计大师Kindlie设计',
    pics: ['http://www.vimage.cn/up/info/201305/20130530095018_66162.jpg']
  }, {
    title: 'design',
    description: '有设计大师Kindlie设计',
    pics: ['http://p4.zbjimg.com/task/2011-08/17/968741/4e4b1606b89d3.jpg']
  }]

exports.find = function(req, res, next) {
  return res.send(mockData)
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

exports.findCategory=function(req,res,next){
  collection().distinct('category', function(err, result) {
    return res.send(result);
  });
}