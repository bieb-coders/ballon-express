var GeoJSON = require('mongoose-geojson-schema');
var mongoose = require('mongoose');
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

var schema = new mongoose.Schema({
    point: mongoose.Schema.Types.Point,
    multipoint: mongoose.Schema.Types.MultiPoint,
    linestring: mongoose.Schema.Types.LineString,
    multilinestring: mongoose.Schema.Types.MultiLineString,
    polygon: mongoose.Schema.Types.Polygon,
    multipolygon: mongoose.Schema.Types.MultiPolygon,
    geometry: mongoose.Schema.Types.Geometry,
    geometrycollection: mongoose.Schema.Types.GeometryCollection,
    feature: mongoose.Schema.Types.Feature,
    featurecollection: mongoose.Schema.Types.FeatureCollection
}, {collection: 'test'});

var GeoJSON = mongoose.model('GeoJSON', schema);

var lines = JSON.parse(fs.readFileSync("./Feature.LineString.json", "utf-8"));
var points = JSON.parse(fs.readFileSync("./Feature.MultiPoint.json", "utf-8"))

var LineString = new GeoJSON(Object.assign({}, lines));
var MultiPoint = new GeoJSON(Object.assign({}, points));
console.log(MultiPoint);

//console.info(line);
//console.log(points);


GeoJSON.remove((error) => {
    assert.equal(error, null);
    console.info("Cleaning up the database");
});

LineString.save((error) => {
    assert.equal(error, null);
    console.info("Your LineString has been saved!");
});

MultiPoint.save((error) => {
    assert.equal(error, null);
    console.info("Your MultiPoint has been saved!");
});




