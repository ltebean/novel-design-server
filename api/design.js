var ObjectID = require('mongodb').ObjectID;
var mongo = require('../lib/db').mongo;
var sync = require('../lib/sync');
var ranaly = require('../lib/ranaly');

var PAGE_SIZE = 15;

function collection() {
  return mongo().collection('design')
}

exports.find = function(req, res, next) {

  var page = req.query.page || 1;
  var order = req.query.order || '_id';
  var category = req.query.category;

  var query = category ? {
    category: category
  } : {};

  var sort = {};
  sort[order] = -1;

  var limit = PAGE_SIZE
  var skip = (page - 1) * PAGE_SIZE;

  var key = 'category:views:' + (order == 'favs' ? '最赞' : (category || '最新'));
  new ranaly.Amount(key).incr();

  collection().find(query).sort(sort).limit(limit).skip(skip).toArray(function(err, results) {
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
  req.body['_id'] = new ObjectID(req.body['_id'])
  collection().update({
      _id: req.body['_id']
    },
    req.body, {
      upsert: true,
      safe: true
    }, function(err, doc) {
      if (err) throw err;
      res.send(200);
    });
}

exports.sync = function(req, res, next) {
  sync.replaceImage(req.body, function(err, data) {
    if (err) {
      throw err
    }
    data['_id'] = new ObjectID(data['_id']);
    collection().update({
        _id: data['_id']
      },
      data, {
        upsert: true,
        safe: true
      }, function(err, doc) {
        if (err) throw err;
        res.send(200);
      });
  })

}

exports.findCategory = function(req, res, next) {
  collection().distinct('category', function(err, result) {
    return res.send(result);
  });
}

exports.list = function(req, res, next) {
  var ids = JSON.parse(req.query.ids).map(function(id) {
    return new ObjectID(id);
  });
  collection().find({
    _id: {
      $in: ids
    }
  }).toArray(function(err, results) {
    new ranaly.Amount('fav:views').incr();
    return res.send(results);
  });
}

exports.addFav = function(req, res, next) {
  collection().update({
    _id: new ObjectID(req.params.id)
  }, {
    $inc: {
      favs: 1
    }
  }, {
    safe: true
  }, function(err) {
    if (err) throw err;
    new ranaly.Amount('fav:add').incr();
    return res.send(200);
  });
}

exports.addComment = function(req, res, next) {
  var avatar = "http://www.gravatar.com/avatar/" + new Date().getTime() + "?s=120&d=identicon"
  var comment = {
    data: new Date(),
    content: req.body.content,
    avatar: avatar,
    name: '匿名用户'
  }
  collection().update({
    _id: new ObjectID(req.params.id)
  }, {
    $push: {
      comments: comment
    }
  }, {
    safe: true
  }, function(err, doc) {
    if (err) throw err;
    new ranaly.Amount('comment').incr();
    return res.send(comment);
  });
}