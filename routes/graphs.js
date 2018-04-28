var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var sensor = require('../models/sensor');

mongoose.Promise = global.Promise;
var Sensor = mongoose.model('Sensor');

/* GET home page. */
router.get('/', (req, res) => {
  Sensor.find({}, {type: 1, lastValue: 1, lastModified: 1, _id: 0})
    .then((sensors) => {
      res.render('graphs', { title: 'Graphs', sensors: sensors });
    })
    .catch((err) => {
      res.status(500);
      res.render(error);
    })
});

// GET the graph data for a sensor
router.get('/sensors/:type', (req, res) => {
  if (req.params.type) {
    Sensor.findOne({type: req.params.type}, {_id: 0})
      .then((sensor) => res.json(sensor))
      .catch((err) => {
        res.status(500);
        res.json({fout: "Oepsie", bericht: "Van dit bericht snap ik niets", error: err});
      })
    } else {
      res.status(400);
      res.json("Graag het sensor type meegeven in het request");
    }
});

router.get('/sensors', (req, res) => {
  Sensor.find({}, {type: 1, lastValue: 1, lastModified: 1, _id: 0})
    .then((sensors) => {
      console.info(sensors);
      res.json(sensors);
    })
    .catch((err) => {
      res.status(500);
      res.json({fout: "Oepsie", bericht: "Van dit bericht snap ik niets", error: err});
    })
});

module.exports = router;