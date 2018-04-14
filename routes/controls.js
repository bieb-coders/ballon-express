var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var lora = require('lora-serialization');
var actuator = require('../models/actuator');
var sensor = require('../models/sensor');
var geoJson = require('../models/geojson');

mongoose.Promise = global.Promise;

var Actuator = mongoose.model('Actuator');
var Sensor = mongoose.model('Sensor');
var GeoJSON = mongoose.model('GeoJSON');

var ttnconfig = require('../TTNKeys.json');
var ttn = require('ttn');

function createSensor(type, initValue) {
    var time = Date.now();
    var sensor = new Sensor();
    sensor.lastModified = time;
    sensor.type = type;
    sensor.lastValue = initValue;
    sensor.labels = [time];
    sensor.series = [initValue];

    sensor.save();
}

function updatePoints(coords) {
    var newCoords = coords.reverse();
    geoJson.findOne({id: 'points'}, {})
        .then((points) => {
            points.geometry.coordinates.push(newCoords);
            var updatedPoints = new GeoJSON(points);
            updatedPoints.save();
        })
        .catch(error => {
            console.log("Unable to find points geoJson file");
        });

    geoJson.findOne({id: 'route'}, {})
        .then((points) => {
            points.geometry.coordinates.push(newCoords);
            var updatedPoints = new GeoJSON(points);
            updatedPoints.save();
        })
        .catch(error => {
            console.log("Unable to find lines geoJson file");
        });
}

function updateSensor(type, value) {
    sensor.findOne({type: type})
        .then(sensor => {
            var time = Date.now();
            sensor.lastModified = time;
            sensor.lastValue = value;
            sensor.labels.push(time);
            sensor.series.push(value);
            var updatedSensor = new Sensor(sensor);
            updatedSensor.save();
        })
        .catch(error => {
            console.log("Unable to update sensor of type "+ type);
        });
}

var ttnClient = new ttn.DataClient(ttnconfig.appID, ttnconfig.accessKey, ttnconfig.mqttUrl);

ttnClient.on("uplink", function(devId, payload) {
    console.log("Received uplink from: " + devId);
    console.log("Payload: " + JSON.stringify(payload));
    console.log("Raw data length:" + payload.payload_raw.length);
    if (payload.payload_raw.length > 1) {
        var decoded = lora.decoder.decode(payload.payload_raw, 
            [lora.decoder.latLng, lora.decoder.uint16, lora.decoder.uint8, lora.decoder.uint8],
            ["coords", "bat", "h", "m"]);
        console.log(JSON.stringify(decoded, null, 2));
        updatePoints(decoded.coords);
        updateSensor("bat", decoded.bat);

    } else {
        var decoded = lora.decoder.decode(payload.payload_raw,
            [lora.decoder.uint8], ["ctrl"]);
        console.log(payload.payload_raw.toString('utf8'));
    }
    
    //var decoded = lora.decoder.decode(payload.payload_raw, [uint8], ['data']);

    //console.log("Decoded data: " + JSON.stringify(decoded));

});

/* GET home page. */
router.get('/', function(req, res) {
    var actuators = [
        Actuator.find({type: "balloon"}).exec(),
        Actuator.find({type: "weight"}).exec()
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
            actuator.save();
            res.json(actuator);
        })
        .catch(function(error){
            res.status(500);
            res.json({message: "Unable to fetch actuator data", error: error});
        });
});
/*
router.post('/ballast', function(req, res) {
    console.log(req.body);
    const command = req.body;
    var weight = weights.find(weight => weight.id === command.id);
    console.log(weight.data);
    var bytes = new lora.LoraMessage(lora.encoder).addUint8(weight.data).getBytes();
    console.log(bytes);
    ttnClient.send('ballon_test2', bytes);
    res.json(weight);
});
*/
module.exports = router;