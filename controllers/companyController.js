const company = require('../models/company');
const Company = require('../models/company');
const System = require('../models/system');
const Countries = require('../models/countries');

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
  Company.findById(req.params.id)
    .exec((err, company) => {
      res.render('showCompany', {title: company.name, company});
    });
};

exports.createCompanyGET = (req, res, next) => {// let companies = {};
  res.render('companyForm', {title: 'Add Company', countries: Countries.countries});
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
  Company.findById(req.params.id)
    .exec((err, company) => {
      if (err) return next(err);
      res.render('companyForm', {title: 'Update Company Data', company, countries: Countries.countries});
    });
};

exports.updateCompanyPOST = [
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
    const company = new Company({
      _id: req.params.id,
      name: req.body.name,
      founded: req.body.founded,
      country: req.body.country
    });

    if (!errors.isEmpty()) {
      res.render('companyForm', {title: 'Update Company Data', company, countries: Countries.countries, errors: errors.array()});
    } else {
      Company.findByIdAndUpdate(req.params.id, company, {}, (err, thisCompany) => {
        if (err) return next(err);
        res.redirect(thisCompany.url);
      });
    }
  }
];

exports.deleteCompanyGET = (req, res, next) => {
  res.send('PENDING');
};

exports.deleteCompanyPOST = (req, res, next) => {
  res.send('PENDING');
};
