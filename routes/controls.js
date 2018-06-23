var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var lora = require('lora-serialization');
var actuator = require('../models/actuator');
var sensor = require('../models/sensor');
var geoJson = require('../models/geojson');
var turf = require('@turf/turf');

mongoose.Promise = global.Promise;

var Actuator = mongoose.model('Actuator');
var Sensor = mongoose.model('Sensor');
var GeoJSON = mongoose.model('GeoJSON');

var ttnconfig = require('../TTNKeys.json');
var ttn = require('ttn');

function updatePoints(coords, time) {
    var newCoords = coords.reverse();
    var dist = 0;
    geoJson.findOne({id: 'points'}, {})
        .then((points) => {
            // Don't calculate distance for first point received
            if (points.geometry.coordinates.length > 0) {
                previousPoint = points.geometry.coordinates[points.geometry.coordinates.length - 1];
                var from = turf.point(previousPoint);
                var to = turf.point(newCoords);
                dist = turf.distance(from, to);
            }
            
            //var dist = turf.distance(turf.points(newCoords), turf.point(previousPoint), {units: 'kilometers'});
            console.info("Distance from previous location: " + dist + "km");
            if(dist > 0.1) {
                points.geometry.coordinates.push(newCoords);
                var updatedPoints = new GeoJSON(points);
                updatedPoints.save();
            } else if (points.geometry.coordinates.length == 0) {
                console.info("Adding first coordinates");
                points.geometry.coordinates.push(newCoords);
                var updatedPoints = new GeoJSON(points);
                updatedPoints.save();
            } else {
                console.info("Not updating points");
            }
            
        })
        .catch(error => {
            console.log("Unable to find points geoJson file", error);
        });

    geoJson.findOne({id: 'route'}, {})
        .then((points) => {        
             if(dist > 0.1) {
                points.geometry.coordinates.push(newCoords);
                var updatedPoints = new GeoJSON(points);
                updatedPoints.save();
             } else if (points.geometry.coordinates.length == 0) {
                console.info("Adding first coordinates");
                points.geometry.coordinates.push(newCoords);
                var updatedPoints = new GeoJSON(points);
                updatedPoints.save();
             } else {
                console.info("Not updating route");
             }
        })
        .catch(error => {
            console.log("Unable to find lines geoJson file");
        });
}

function updateSensor(type, value, time) {
    console.info(JSON.stringify(value));
    sensor.findOne({type: type})
        .then(sensor => {
            sensor.lastModified = time;
            sensor.lastValue = value;
            sensor.labels.push(time);
            sensor.series.push(value);
            var updatedSensor = new Sensor(sensor);
            updatedSensor.save();
        })
        .catch(error => {
            console.warn("Unable to update sensor of type "+ type);
        });
}

var ttnClient = new ttn.DataClient(ttnconfig.appID, ttnconfig.accessKey, ttnconfig.mqttUrl);

ttnClient.on("uplink", function(devId, payload) {
    console.log("Received uplink from: " + devId);
    console.log("Payload: " + JSON.stringify(payload));
    console.log("Raw data length:" + payload.payload_raw.length);
    if (payload.payload_raw.length > 1) {
        var decoded = lora.decoder.decode(payload.payload_raw, 
        [
            lora.decoder.latLng,
            lora.decoder.temperature,
            lora.decoder.temperature,
            lora.decoder.uint16,
            lora.decoder.uint16,
            lora.decoder.uint16,
            lora.decoder.uint16,
            lora.decoder.uint16,
            lora.decoder.uint16,
            lora.decoder.uint16,
            lora.decoder.uint16,
            lora.decoder.uint8, 
            lora.decoder.uint8
        ],[
            "coords", 
             "temp",
             "press",
             "xaccl",
             "yaccl",
             "zaccl",
             "xmag",
             "ymag",
             "zmag",
             "light",
             "bat",
             "h",
             "m"
        ]);
        console.log(JSON.stringify(decoded, null, 2));
        var time = new Date();
        time.setHours(decoded.h, decoded.m, 0, 0);
        updatePoints(decoded.coords, time);
        updateSensor("temp", decoded.temp, time);
        updateSensor("press", decoded.press, time);
        updateSensor("light", decoded.light, time);
        updateSensor("bat", decoded.bat, time);

    } else {
        var decoded = lora.decoder.decode(payload.payload_raw,
            [lora.decoder.uint8], ["ctrl"]);
        console.log(payload.payload_raw.toString('utf8'));
    }
    
    //var decoded = lora.decoder.decode(payload.payload_raw, [uint8], ['data']);

    //console.log("Decoded data: " + JSON.stringify(decoded));

});

/* GET home page. */
router.get('/', (req, res) => {
    var actuators = [
        Actuator.find({type: "balloon"}).sort({id: 1}).exec(),
        Actuator.find({type: "weight"}).sort({id: 1}).exec()
    ];

    Promise.all(actuators).then(function(results) {
        //console.log(results);
        res.render('controls', {title: "Controls", balloons: results[0], weights: results[1]});
    }).catch(function(error){
        res.status(500);
        res.render('error', {error: error, message: "Unable to get actuators from MongoDB"});
    });

    //res.render('controls', {title: "Controls", balloons: balloons, weights: weights});
});

router.post('/actuator', function(req, res) {
    const command = req.body;
    Actuator.findOne({id: command.id})
        .then(function(actuator) {
            //console.log(actuator.data);
            var bytes = new lora.LoraMessage(lora.encoder).addUint8(actuator.data).getBytes();
            //console.log(bytes);
            ttnClient.send('ballon_test2', bytes);
            actuator.lastModified = new Date();
            actuator.used = command.used;
            actuator.save();
            res.json(actuator);
        })
        .catch(function(error){
            res.status(500);
            res.json({message: "Unable to fetch actuator data", error: error});
        });
});

module.exports = router;