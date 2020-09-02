const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: {type: String, required: true},
  country: {type: String, required: true},
  founded: {type: Number, required: true, min: 1000, max: new Date().getFullYear()}
});

CompanySchema.virtual('url').get(function () {
  return `/inventory/company/${this._id}`;
});

module.exports = mongoose.model('Company', CompanySchema);