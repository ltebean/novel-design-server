var http = require('http');
var path = require('path');
var express = require('express');
var design = require('./api/design');

var app = express();
app.configure(function() {
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use('/public', express.static(path.join(__dirname, './public/')));
  app.use(app.router);
});

function check(req,res,next){
  if(req.cookies.u==='ltebean'){
    return next()
  }else{
    return res.send(403);
  }
}

app.get('/api/design/list', design.list);
app.get('/api/design', design.find);
app.get('/api/design/:id', design.load);
app.post('/api/design',check, design.save);
app.post('/api/design/sync',check, design.sync);
app.post('/api/design/:id/fav', design.addFav);
app.post('/api/design/:id/comment', design.addComment);

app.get('/api/category', design.findCategory);

http.createServer(app).listen(8090, function() {
  console.log('Listening on port 8090');
});