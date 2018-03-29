var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var lora = require('lora-serialization');
var actuator = require('../models/actuator');

mongoose.Promise = global.Promise;

var Actuator = mongoose.model('Actuator');

var ttnconfig = require('../TTNKeys.json');
var ttn = require('ttn');

//var balloons = Actuator.find({type: 'balloon'});

var weights = [
    {id: "ballast_1", name: "Ballast 1", data: 6, lastModified: 0},
    {id: "ballast_2", name: "Ballast 2", data: 7, lastModified: 0},
    {id: "ballast_3", name: "Ballast 3", data: 8, lastModified: 0}
]

var ttnClient = new ttn.DataClient(ttnconfig.appID, ttnconfig.accessKey, ttnconfig.mqttUrl);

ttnClient.on("uplink", function(devId, payload) {
    console.log("Received uplink from: " + devId);
    console.log("Payload: " + JSON.stringify(payload));
    console.log("Raw data:" + payload.payload_raw);
    var decoded = lora.decoder.decode(payload.payload_raw, 
        [lora.decoder.uint8],
    ["d"]);
    console.log(JSON.stringify(decoded));
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