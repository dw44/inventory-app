const company = require('../models/company');
const Company = require('../models/company');
const System = require('../models/system');

const async = require('async');
const { body, validationResult } = require('express-validator'); 

exports.showAllCompanies = (req, res, next) => {
  Company.find()
    .populate('company')
    .sort([['name', 'ascending']])
    .exec((err, companyList) => {
      if (err) return next(err);
      res.render('allCompanies', {title: 'System Manufacturers', companies: companyList});
    });
};

exports.showCompany = (req, res, next) => {
  async.parallel({
    company: callback => {Company.findById(req.params.id).exec(callback)},
    companySystems: callback => {System.find({'company': req.params.id}, 'name')}
  }, (err, results) => {
    if (err) return next(err);
    if (results.company === null) {
      const err = new Error('Company Not Found');
      err.status = 404;
      return next(err);
    }
    res.render('showCompany', {title: 'Manufacturer Page', company: results.company, systems: results.companySystems});
  });
};

exports.createCompanyGET = (req, res, next) => {// let companies = {};
  res.render('companyForm', {title: 'Add Company'});
};

exports.createCompanyPOST = [
  body('name')
    .not().isEmpty()
    .isLength({min: 1})
    .trim()
    .escape(),
  body('country')
    .isLength({min: 1})
    .trim()
    .escape(),
  body('founded')
    .isNumeric({min: 1972, max: new Date().getFullYear()}),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('companyForm', {title: 'Add Company'});
        return;
      } else {
        const company = new Company({
          name: req.body.name,
          country: req.body.country,
          founded: req.body.founded
        });
        company.save(err => {
          if (err) return next(err);
          res.redirect('/inventory/companies');
        })
      }
    }
];

exports.updateCompanyGET = (req, res, next) => {
  res.send('PENDING');
};

exports.updateCompanyPOST = (req, res, next) => {
  res.send('PENDING');
};

exports.deleteCompanyGET = (req, res, next) => {
  res.send('PENDING');
};

exports.deleteCompanyPOST = (req, res, next) => {
  res.send('PENDING');
};
