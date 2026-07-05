var express = require('express');
var path = require('path');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

var index = require('./server/routes/app');
var messageRoutes = require('./server/routes/messages');
var contactRoutes = require('./server/routes/contacts');
var documentRoutes = require('./server/routes/documents');

// establish a connection to the mongo database
mongoose
  .connect('mongodb://localhost:27017/cms')
  .then(function() {
    console.log('Connected to database!');
  })
  .catch(function(err) {
    console.log('Connection failed: ' + err);
  });

var app = express();
var browserDistDir = path.join(__dirname, 'dist', 'cms', 'browser');
var indexFile = path.join(browserDistDir, 'index.html');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(logger('dev'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use(express.static(browserDistDir));

app.use('/', index);
app.use('/messages', messageRoutes);
app.use('/contacts', contactRoutes);
app.use('/documents', documentRoutes);

app.get(/.*/, function(req, res) {
  res.sendFile(indexFile);
});

var port = process.env.PORT || '3000';
app.set('port', port);

var server = http.createServer(app);

server.listen(port, function() {
  console.log('API running on localhost: ' + port);
});