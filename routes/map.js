var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Json = require('../models/map');

/* GET Map page. */
router.get('/', function(req,res) {
    var db = req.db;
    Json.find({},{}, function(e,docs){
        res.render('map', {
            "jmap" : docs,
            lat : 52.632750,
            lng : 4.74386
        });
    });
});

/* GET json data. */
router.get('/mapjson/:name', function (req, res) {
    if (req.params.name) {
        Json.findOne({ name: req.params.name },{}, function (err, docs) {
            res.json(docs);
        });
    }
});

/* GET layers json data. */
router.get('/maplayers', function (req, res) {
    Json.find({},{'name': 1}, function (err, docs) {
        res.json(docs);
    });
});

module.exports = router;