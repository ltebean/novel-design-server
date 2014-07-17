var express = require('express');
var http = require('http');
var design= require('./api/design');

var app = express();
app.configure(function() {
    app.use(express.bodyParser());
    app.use(app.router);
});

app.get('/api/design/list', design.list);
app.get('/api/design', design.find);
app.get('/api/design/:id', design.load);
app.post('/api/design', design.save);
app.post('/api/design/:id/fav', design.addFav);

app.get('/api/category', design.findCategory);

http.createServer(app).listen(8090, function() {
  console.log('Listening on port 8090');
});
