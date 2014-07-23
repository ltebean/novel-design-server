var async = require('async');
var src2qiniu = require('src2qiniu');
var config = require('../config').qiniu;

src2qiniu.init({
  accessKey: config.accessKey,
  secretKey: config.secretKey,
  bucket: 'novel-design'
});


exports.replaceImage = function(data, cb) {
  async.waterfall([

    function replaceThumb(done) {
      src2qiniu.transfer(data.thumb, function(err, imgUrl) {
        if (err) return done(err);
        data.thumb = imgUrl;
        done(null);
      });
    },
    function replaceDetail(done) {
      async.each(data.detail, function(detail, done) {
        src2qiniu.transfer(detail.pic, function(err, imgUrl) {
          if (err) return done(err);
          detail.pic = imgUrl;
          done(null);
        });
      }, function(err) {
        done(err);
      })
    }
  ], function(err) {
    cb(err, data);
  });
}