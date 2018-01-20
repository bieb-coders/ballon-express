var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var geoJson = require('../models/geojson');

mongoose.Promise = global.Promise;

var GeoJSON = mongoose.model('GeoJSON');

/* GET home page. */
router.get('/', function(req, res) {

  geoJson.find({},{type: 1, id: 1, _id: 0, properties: 1})
  .then(function(features){
      res.render('maps', {title: "Map", features: features, lat: 52.632750, lng: 4.74386});
  }).catch(function(error){
      res.status(500);
      res.render('error');
  });
});

module.exports = router;