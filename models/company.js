const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: {type: String, required: true},
  systems: [{type: Schema.Types.ObjectId, ref: 'System', required: true}]  
});

SystemSchema.virtual('url').get(function () {
  return `/inventory/company/${this._id}`;
});

module.exports = mongoose.model('Company', CompanySchema);