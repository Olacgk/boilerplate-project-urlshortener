require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dns = require('dns');
const bodyParser = require("body-parser");
const shortid = require('shortid');
const { Schema } = mongoose;
const urlparser = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}).then(resolve => {console.log('connected')})

let urlSchema = mongoose.model("urlSchema", new Schema({
  original_url: {type: String, required: true},
  short_url: String
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

app.get('/api/shorturl/:short_url', function(req, res){
  urlSchema.findOne({short_url: req.params.short_url}, function(err, url){
    if (err) return console.log(err);
    return res.redirect(url.original_url);
  })
});

app.post('/api/shorturl', function(req, res){
  var original_url = req.body.url
  var short_url = Date.now()
  const newUrl = new urlSchema({
    original_url: original_url,
    short_url: short_url
  })
  const something = dns.lookup(urlparser.parse(original_url).hostname, (error, address) => {
   if (!address) {
     res.json({error: 'invalid url'})
   } else {
     newUrl.save((err, data) => {
       res.json({
         "original_url": newUrl.original_url,
         "short_url": newUrl.short_url
       })
     })
   }
 })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
