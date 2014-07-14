var express = require('express');
var http = require('http');
var design= require('./api/design');

var app = express();
app.configure(function() {
    app.use(express.bodyParser());
    app.use(app.router);
});

app.get('/api/design', design.find);
app.get('/api/design/:id', design.load);
app.post('/api/design', design.save);

app.get('/api/category', design.findCategory);

http.createServer(app).listen(3000, function() {
  console.log('Listening on port 3000');
});
