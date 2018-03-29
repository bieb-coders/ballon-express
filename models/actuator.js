var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  _id: {type: Schema.ObjectId, auto: true},
  id: {type: Schema.Types.String},
  name: {type: Schema.Types.String},
  data: {type: Schema.Types.Number},
  lastModified: {type: Schema.Types.Date},
  type: {type: Schema.Types.String}
}, {collection: "actuators"});

module.exports = mongoose.model('Actuator', schema);


