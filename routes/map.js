var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var geoJson = require('../models/geojson');

mongoose.Promise = global.Promise;

var GeoJSON = mongoose.model('GeoJSON');


/* GET Map page. */
router.get('/', function(req,res) {
    var db = req.db;
    geoJson.find({},{}).then(function(docs){
        res.render('map', {
            "jmap" : docs,
            lat : 52.632750,
            lng : 4.74386
        });
    }).catch(function(){
        res.status(500);
        res.render('error');
    });
});

/* GET a list of all layers. */
router.get('/layers', function (req, res) {
    geoJson.find({},{name: 1, type: 1})
        .then(function(docs) {
            res.json(docs);
        })
        .catch(function(error){
            res.status(500);
            res.json({fout: "Oepsie", bericht: "Er is blijkbaar iets mis gegaan", details: error})
        });
});

/* GET specific layer of type. */
router.get('/layers/:name', function (req, res) {
    if (req.params.name) {
        geoJson.findOne({ name: req.params.name },{}, function (err, docs) {
            res.json(docs);
        });
    }
});

router.post('/layers/:name', function (req, res){
    switch(req.params.name) {
        case 'points':
            console.log('received a point update');
            // Get the current list of points and add this one as the last
            geoJson.findOne({id: req.params.name}, {}).then(function(points) {
                var newPoint = req.body;
                points.geometry.coordinates.push(newPoint);
                var updatedPoints = new GeoJSON(points);
                updatedPoints.save();
                res.json(updatedPoints);
            }).catch(function(err){
                res.status(500);
                res.json({fout: "Oepsie", bericht: "Van dit bericht kan ik snap ik niets", error: err});
            });
            break;
        case 'lines':
            console.log('received a line update');
            res.json({status: 'OK'});
            break;
        default:
            res.status(400);
            res.json({fout: "Oepsie", bericht: "Van dit bericht kan ik snap ik niets"});
    }
});

module.exports = router;