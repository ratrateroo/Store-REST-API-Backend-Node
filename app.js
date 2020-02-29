const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const feedRoutes = require('./routes/feed');

const app = express();

//app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);
const MONGODB_URI = 'mongodb://localhost/storerestdb';
mongoose.connect(MONGODB_URI);
app.listen(8080);
