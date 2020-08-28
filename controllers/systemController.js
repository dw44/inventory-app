const System = require('../models/system');
const Company = require('../models/company');
const Unit = require('../models/unit');

const async = require('async');

exports.index = (req, res, next) => {
  async.parallel({
    systemCount: callback => {System.countDocuments({}, callback)},
    unitCount: callback => {Unit.countDocuments({}, callback)},
    companyCount: callback => {Company.countDocuments({}, callback)}
  }, (err, results) => {
    res.render('inventory', {title: 'Inventory Home', error: err, data: results});
  });
};

exports.allSystems = (req, res, next) => {
  System.find({}, 'company')
    .populate('company')
    .exec((err, systems) => {
      if (err) return next(err);
      res.render('allSystems', {title: 'All Systems', systems});
    });
};

exports.showSystem = (req, res, next) => {
  async.parallel({
    system: callback => {
      System.findById(req.params.id)
        .populate('company')
        .exec(callback);
    },
    units: callback => {
      Unit.find({'system': req.params.id})
        .exec(callback);
    }
  }, (err, results) => {
    if (err) return next(err);
    if (results.system === null) {
      const err = new Error('System Not Found.');
      err.status = 404;
      return next(err);
    }
    res.render('showSystem', {title: results.system.name, system: results.system, units: results.units});
  });
};

exports.createSystemGET = (req, res, next) => {
  async.parallel({
    companies: callback => {Company.find(callback)}
  }, (err, results) => {
    if (err) return next(err);
    res.render('systemForm', {title: 'Add System', companies: results.companies});
  });
};

exports.createSystemPOST = (req, res, next) => {
  res.send('PENDING'); 
};

exports.updateSystemGET = (req, res, next) => {
  res.send('PENDING'); 
};

exports.updateSystemPOST = (req, res, next) => {
  res.send('PENDING'); 
};

exports.deleteSystemGET = (req, res, next) => {
  res.send('PENDING'); 
};

exports.deleteSystemPOST = (req, res, next) => {
  res.send('PENDING'); 
};