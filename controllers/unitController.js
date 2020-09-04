const Unit = require('../models/unit');
const System = require('../models/system');
const Company = require('../models/company');

const { body, validationResult } = require('express-validator'); 

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
  res.send('PENDING');
};

exports.updateUnitPOST = (req, res, next) => {
  res.send('PENDING');
};

exports.deleteUnitGET = (req, res, next) => {
  res.send('PENDING');
};

exports.deleteUnitPOST = (req, res, next) => {
  res.send('PENDING');
};