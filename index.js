require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dns = require('dns');
const bodyParser = require("body-parser");
const { Schema } = mongoose;

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true})

let urlSchema = mongoose.model("urlSchema", new Schema({
  original_url: {type: String, required: true},
  short_url: {type: String, required: true}
}));

app.use(bodyParser.urlencoded({extended: false}))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl', function(req, res){
  
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
