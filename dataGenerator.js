import { random } from '@turf/turf';

var mongoose = require('mongoose');
var sensor = require('./models/sensor');
var Sensor = mongoose.model('Sensor');

const databaseName = "ballon-express";
var actuatorsDone = false;
var sensorsDone = false;


function updateSensor(type, value) {
  console.info(JSON.stringify(value));
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
          console.warn("Unable to update sensor of type "+ type);
      });
}

setInterval(() => {
  var bat = Math.floor(Math.random() * 100);
  var temp = Math.floor(Math.random * 20);
  var hum = Math.floor(Math.random * 30) + 99;

  updateSensor("bat", bat);
  updateSensor("temp", temp);
  updateSensor("hum", hum);
}, 2000);