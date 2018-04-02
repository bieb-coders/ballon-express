var mongoose = require('mongoose');
var geoJson = require('./models/geojsontest');

mongoose.Promise = global.Promise;

var GeoJSON = mongoose.model('GeoJSON');
var line = require("./Feature.LineString.json");
var points = require("./Feature.MultiPoint.json")
var assert = require("assert");
var fs = require('fs');


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/ballon-express", { useMongoClient: true});


var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
    console.log("Connection succeeded.");
});


//var lines = JSON.parse(fs.readFileSync("./Feature.LineString.json", "utf-8"));
//var points = JSON.parse(fs.readFileSync("./Feature.MultiPoint.json", "utf-8"))

var LineString = new GeoJSON({feature: line})
var MultiPoint = new GeoJSON({feature: points});
console.log(JSON.stringify(MultiPoint, null, 2));

//console.info(line);
//console.log(points);


GeoJSON.remove((error) => {
    assert.equal(error, null);
    console.info("Cleaning up the database");
});

LineString.save();
MultiPoint.save();





