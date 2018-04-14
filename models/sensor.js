var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  _id: {type: Schema.ObjectId, auto: true},
  lastModified: {type: Schema.Types.Date},
  type: {type: Schema.Types.String},
  labels: {type: Schema.Types.Array},
  series: {type: Schema.Types.Array},
  lastValue: {type: Schema.Types.Number}
}, {collection: "sensors"});

module.exports = mongoose.model('Sensor', schema);