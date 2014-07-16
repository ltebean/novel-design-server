var ObjectID = require('mongodb').ObjectID;
var mongo = require('../lib/db').mongo;

var PAGE_SIZE = 20;

function collection() {
  return mongo().collection('design')
}

var mockData = [{
  title: 'best design',
  description: '非常精美别致的厨房设计，有设计大师Kindlie设计',
  thumb: 'https://okl1-scene7.insnw.net/is/image/OKL/SalesEvent_38890_Lifestyle_1?$large$',
  detail: [{
    pic: 'https://okl1-scene7.insnw.net/is/image/OKL/SalesEvent_38890_Lifestyle_1?$large$',
    txt: '这里放一些文字介绍'
  }, {
    pic: 'https://okl1-scene7.insnw.net/is/image/OKL/SalesEvent_39601_Lifestyle_1?$large$'
  }]
}, {
  title: 'House',
  description: '非常精美别致的厨房设计，有设计大师Kindlie设计非常精美别致的厨房设计，有设计大师Kindlie设计非常精美别致的厨房设计，有设计大师Kindlie设计',
  thumb: 'https://okl1-scene7.insnw.net/is/image/OKL/SalesEvent_40396_Lifestyle_1?$large$',
  detail: [{
    pic: 'https://okl1-scene7.insnw.net/is/image/OKL/SalesEvent_40396_Lifestyle_1?$large$'
  }],
  comments: [{
    name: 'ltebean',
    avatar: 'https://avatars0.githubusercontent.com/u/1646564?s=460',
    content: '非常精美别致的厨房设计，有设计大师Kindlie设计',
    date: new Date()
  }, {
    name: 'ltebean',
    avatar: 'https://avatars0.githubusercontent.com/u/1646564?s=460',
    content: '非常精美别致的厨房设计',
    date: new Date()
  }]
}, {
  title: 'best design',
  description: '非常精美别致的厨房设计，有设计大师Kindlie设计',
  thum: 'https://okl1-scene7.insnw.net/is/image/OKL/SalesEvent_39855_Lifestyle_1?$large$',
  detail: [{
    pic: 'https://okl1-scene7.insnw.net/is/image/OKL/SalesEvent_39855_Lifestyle_1?$large$'
  }]
}, {
  title: 'design',
  description: '有设计大师Kindlie设计',
  thumb: 'https://okl-scene7.insnw.net/is/image/OKL/SalesEvent_40215_Lifestyle_1?$large$',
  detail: [{
    pic: 'https://okl-scene7.insnw.net/is/image/OKL/SalesEvent_40215_Lifestyle_1?$large$'
  }]
}]

exports.find = function(req, res, next) {
  return res.send(mockData);
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
  return res.send(['最新', '热门', '家居', '小物件', '最新', '热门', '家居', '小物件'])
  collection().distinct('category', function(err, result) {
    return res.send(result);
  });
}