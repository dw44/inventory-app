const System = require('../models/system');
const Company = require('../models/company');
const Unit = require('../models/unit');

const {body, validationResult, sanitizeBody} = require('express-validator');
const async = require('async');
const company = require('../models/company');

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
  System.find({})
    .populate('company')
    .sort([['company.name', 'ascending']])
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
    res.render('showSystem', {title: `${results.system.company.name} ${results.system.name}`, system: results.system, units: results.units});
  });
};

exports.createSystemGET = (req, res, next) => {
  Company.find()
    .exec((err, companyList) => {
      if (err) return next(err);
      res.render('systemForm', {title: 'Add System', companyList});
    });
};

exports.createSystemPOST = [
  // Validate
  body('name', '"Name" field required').trim().isLength({min: 1}).trim().escape(),
  body('company').trim().isLength({min: 1}),
  body('released', `Release year needs to be between 1972 and ${new Date().getFullYear()}`).isNumeric({min: 1972, max: new Date().getFullYear()}),
  body('generation', 'Generation needs to be between 1 and 8').isNumeric({min: 1972, max: new Date().getFullYear()}),
  body('storageMedium').trim().isLength({min: 1}).trim().escape(),
  
  // Handle
  (req, res, next) => {
    const errors = validationResult(req);

    const system = new System({
      name: req.body.name,
      company: req.body.company,
      released: req.body.released,
      generation: req.body.generation,
      storageMedium: req.body.storageMedium
    });

    if (!errors.isEmpty()) {
      res.render('systemForm', {title: 'Add System', system, error: errors.array()});
      return;
    } else {
      system.save(err => {
        if (err) return next(err);
        res.redirect(system.url);
      });
    }
  }
];

exports.updateSystemGET = (req, res, next) => {
  async.parallel({
    system: callback => {System.findById(req.params.id).populate('company').exec(callback)},
    companies: callback => {Company.find(callback)} 
  }, (err, results) => {
    if (err) return next(err);
    if (results.system === null) {
      const err = new Error('System Not Found!');
      err.status = 404;
      return next(err);
    }
    res.render('systemForm', {title: 'Edit System Details', system: results.system, companyList: results.companies});
  });
};

exports.updateSystemPOST = [
  body('name', '"Name" field required').trim().isLength({min: 1}).trim().escape(),
  body('company').trim().isLength({min: 1}),
  body('released', `Release year needs to be between 1972 and ${new Date().getFullYear()}`).isNumeric({min: 1972, max: new Date().getFullYear()}),
  body('generation', 'Generation needs to be between 1 and 8').isNumeric({min: 1972, max: new Date().getFullYear()}),
  body('storageMedium').trim().isLength({min: 1}).trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const system = new System({
      _id: req.params.id,
      name: req.body.name,
      company: req.body.company,
      released: req.body.released,
      generation: req.body.generation,
      storageMedium: req.body.storageMedium,
    });

    if (!errors.isEmpty()) {
      Company.find()
        .exec((err, companyList) => {
          if (err) return next(err);
          res.render('systemForm', {companyList, system, errors: errors.array()});
        });
    } else {
      System.findByIdAndUpdate(req.params.id, system, {}, (err, thisSystem) => {
        res.redirect(thisSystem.url);
      });
    }
  }
];

exports.deleteSystemGET = (req, res, next) => {
  async.parallel({
    system: callback => {System.findById(req.params.id).populate('company').exec(callback)},
    units: callback => {Unit.find({'system': req.params.id}).exec(callback)}
  }, (err, results) => {
    if (err) return next(err);
    res.render('systemDelete', {title: 'Delete System Entry', system: results.system, units: results.units});
  });
};

exports.deleteSystemPOST = (req, res, next) => {
  async.parallel({
    system: callback => {System.findById(req.body.id).populate('company').exec(callback)},
    units: callback => {Unit.find({'system': req.body.id}).exec(callback)}
  }, (err, results) => {
    if (err) return next(err);
    if (results.units.length > 0) {
      res.render('systemDelete', {title: 'Delete System Entry', system: results.system, units: results.units});
      return;
    } else {
      System.findByIdAndRemove(req.body.id, err => {
        if (err) return next(err);
        res.redirect('/inventory/systems');
      });
    }
  });
};

