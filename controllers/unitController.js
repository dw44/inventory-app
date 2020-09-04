const Unit = require('../models/unit');
const System = require('../models/system');
const Company = require('../models/company');

const { body, validationResult } = require('express-validator'); 
const async = require('async');
const unit = require('../models/unit');

exports.showAllUnits = (req, res, next) => {
  Unit.find()
    .populate('system')
    .exec((err, systemUnits) => {
      res.render('allUnits', {title: 'Units in Stock', units: systemUnits});
    });
};

exports.showUnit = (req, res, next) => {
  Unit.findById(req.params.id)
    .populate('system')
    .exec((err, unit) => {
      if (err) return next(err);
      if (unit === null) {
        const err = new Error('Unit Not Found');
        err.status = 404;
        return next(err);
      }
      res.render('showUnit', {title: 'Unit', unit: unit});
    });
};

exports.createUnitGET = (req, res, next) => {
  System.find({})
    .exec((err, systems) => {
      if (err) return next(err);
      res.render('unitForm', {title: 'Add Unit', systemList: systems});
    });
};

exports.createUnitPOST = [
  body('system')
    .isLength({min: 1})
    .trim()
    .escape(),
  body('condition')
    .isLength({min: 1})
    .trim()
    .escape(),
  body('region')
    .isLength({min: 1})
    .trim()
    .escape(),
  body('price')
    .not().isEmpty()
    .isNumeric()
    .trim()
    .escape(),
  
  (req, res, next) => {
    const errors = validationResult(req);

    const unit = new Unit({
      system: req.body.system,
      condition: req.body.condition,
      region: req.body.region,
      price: req.body.price
    });

    if (!errors.isEmpty()) {
      res.render('unitForm', {title: 'Add Unit', errors: errors.array()});
      return;
    } else {
      unit.save(err => {
        if (err) return next(err);
        res.redirect('/inventory/units'); // change later
      });
    }
  }
];

exports.updateUnitGET = (req, res, next) => {
  async.parallel({
    unit: callback => {Unit.findById(req.params.id).populate('system').exec(callback)},
    systems: callback => {System.find(callback)}
  }, (err, results) => {
    if (err) return next(err);
    if (results.unit === null) {
      const err = new Error('Unit Not Found!');
      err.status = 404;
      return next(err);
    }
    res.render('unitForm', {title: 'Update Unit Data', unit: results.unit, systemList: results.systems});
  });
};

exports.updateUnitPOST = [
  body('system')
    .isLength({min: 1})
    .trim()
    .escape(),
  body('condition')
    .isLength({min: 1})
    .trim()
    .escape(),
  body('region')
    .isLength({min: 1})
    .trim()
    .escape(),
  body('price')
    .not().isEmpty()
    .isNumeric()
    .trim()
    .escape(),
    
    (req, res, next) => {
      const errors = validationResult(req);
      const unit = new Unit({
        _id: req.params.id,
        system: req.body.system,
        condition: req.body.condition,
        region: req.body.region,
        price: req.body.price
      });
      
      if (!errors.isEmpty()) {
        System.find()
          .exec((err, systemList) => {
            if (err) return next(err);
            res.render('unitForm', {title: 'Update Unit Data', systemList, unit, errors: errors.array()});
          });
      } else {
        Unit.findByIdAndUpdate(req.params.id, unit, {}, (err, thisUnit) => {
          res.redirect(thisUnit.url);
        });
      }
    }
];

exports.deleteUnitGET = (req, res, next) => {
  Unit.findById(req.params.id)
    .populate('system')
    .exec((err, unit) => {
      if (err) return next(err);
      res.render('unitDelete', {title: 'Delete Unit Data', unit});
    });
};

exports.deleteUnitPOST = (req, res, next) => {
  unit.findByIdAndRemove(req.body.id, err => {
    if (err) return next(err);
    res.redirect('/inventory/units');
  });
};