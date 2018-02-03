var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var lora = require('lora-serialization');

mongoose.Promise = global.Promise;

var ttnconfig = require('../TTNKeys.json');
var ttn = require('ttn');

var balloons = [
    {id: "ballon1", name: "Ballon A", data: 1},
    {id: "ballon2", name: "Ballon B", data: 2},
    {id: "ballon3", name: "Ballon C", data: 3}
];

var ttnClient = new ttn.DataClient(ttnconfig.appID, ttnconfig.accessKey, ttnconfig.mqttUrl);

ttnClient.on("uplink", function(devId, payload) {
    console.log("Received uplink from: " + devId);
    console.log("Payload: " + JSON.stringify(payload));
    console.log("Raw data:" + payload.payload_raw.data);
    //var decoded = lora.decoder.decode(payload.payload_raw, [uint8], ['data']);

    //console.log("Decoded data: " + JSON.stringify(decoded));

});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('controls', {title: "Controls", balloons: balloons});
});

router.post('/ballon', function(req, res) {

    const command = req.body;
    var balloon = balloons.find(balloon => balloon.id === command.id);
    console.log(balloon.data);
    var bytes = new lora.LoraMessage(lora.encoder).addUint8(balloon.data).getBytes();
    console.log(bytes);
    ttnClient.send(command.id, bytes);
    res.json(balloon);

});

router.post('/ballast', function(req, res) {

});

module.exports = router;