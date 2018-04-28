var mongoose = require('mongoose');
var geoJson = require('./models/geojson');
var sensor = require('./models/sensor');
var actuator = require('./models/actuator');

var GeoJSON = mongoose.model('GeoJSON');
var Sensor = mongoose.model('Sensor');
var Actuator = mongoose.model('Actuator');
var line = require("./Feature.LineString.json");
var points = require("./Feature.MultiPoint.json");
var assert = require("assert");
var fs = require('fs');

const databaseName = "ballon-express";
var actuatorsDone = false;
var sensorsDone = false;

// Change this if we have more sensors and/or actuators
var sensortypes = ["bat", "hum", "temp"];
var actuatortypes = [{type: "balloon", prefix: "Ballon", count: 6}, {type: "weight", prefix: "Ballast", count: 3}];

function createSensor(type, initValue) {
    var time = Date.now();
    var sensor = new Sensor();
    sensor.lastModified = time;
    sensor.type = type;
    sensor.lastValue = initValue;
    sensor.labels = time;
    sensor.series = initValue;

    promises.push(
        sensor.save()
        .then(() => console.info("Create sensor of type: " + type))
        .catch((err) => console.info("Unable to create sensor of type: " + type))
    );
}

function createActuator(id, type, initValue, namePrefix) {
    var time = Date.now();
    var actuator = new Actuator();
    actuator.lastModified = time;
    actuator.type = type;
    actuator.data = initValue;
    actuator.id = namePrefix.toLowerCase() + '_' + id;
    actuator.name = namePrefix + ' ' + String.fromCharCode(64 + id);

    promises.push(
        actuator.save()
        .then(() => console.info("Create actuator of type: " + type))
        .catch((err) => console.info("Unable to create actuator of type: " + type))
    );
}

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/" + databaseName, { useMongoClient: true});


var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.info("Connection succeeded.");
    console.info("Dropping database " + databaseName);
    db.dropDatabase(databaseName, (err)=> {
        console.error("Unable to drop database " + databaseName, err);
    });

});

var promises = [];

console.info('Insert initial/sample data');

promises.push(
    db.collection('layercollection').save(line, (error, result) => {
        if(error) {
            console.error("Unable to save " + line.propeties.name);
        } else {
            console.info("Saved " + line.properties.name);
        }
}));

promises.push(
    db.collection('layercollection').save(points, (error, result) => {
        if(error) {
            console.error("Unable to save " + points.propeties.name);
        } else {
            console.info("Saved " + points.properties.name);
        }
}));

sensortypes.forEach(s => {
    createSensor(s, 0);
});

actuatortypes.forEach(a => {
    for ( var i = 1; i < a.count+1; i++) {
        createActuator(i, a.type, 0, a.prefix);
    }
});

Promise.all(promises)
    .then(() => {
        console.info("All done");
        process.exit(0);
    }
);






