const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SystemSchema = new Schema({
  name: {type: String, required: true},
  company: {type: Schema.Types.ObjectId, ref: 'Company', required: true},
  released: {type: Number, min: 1972, max: new Date().getFullYear(), required: true},
  storageMedium: {type: String, enum: ['Cartridge', 'CD', 'DVD', 'Blu Ray', 'Proprietary Optical'], required: true}
});

SystemSchema.virtual('url').get(function () {
  return `/inventory/system/${this._id}`;
});

module.exports = mongoose.model('System', SystemSchema);