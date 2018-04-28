var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  _id: {type: Schema.ObjectId, auto: true},
  lastModified: {type: Schema.Types.Date},
  type: {type: Schema.Types.String},
  labels: [Schema.Types.Date],
  series: [Schema.Types.Number],
  lastValue: {type: Schema.Types.Number}
}, {collection: "sensors"});

module.exports = mongoose.model('Sensor', schema);