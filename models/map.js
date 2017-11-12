var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MapSchema = new Schema({
  name: String,
  type: Schema.Types.Mixed
}, {collection: 'layercollection'});

module.exports = mongoose.model('JString', MapSchema);