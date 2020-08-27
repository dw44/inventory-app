const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UnitSchema = new Schema({
  system: {type: Schema.Types.ObjectId, ref: 'System', required: true},
  condition: {type: String, enum: ['New', 'Open-Box', 'Refurbished', 'Used', 'For-Parts'], required: true},
  region: {type: String, enum: ['NTSC-UC', 'NTSC-J', 'PAL', 'Region-Free'], required: true},
  price: {type: Number, required: true}
});

UnitSchema.virtual('url').get(function () {
  return `/inventory/unit/${this._id}`;
});

module.exports = mongoose.model('Unit', UnitSchema);