const express = require('express');
const router = express.Router();

const systemController = require('../controllers/systemController');
const companyController = require('../controllers/companyController');
const unitController = require('../controllers/unitController');

// ---------- System Routes ----------

// System inventory
router.get('/', systemController.index);

// GET - display all systems
router.get('/systems', systemController.allSystems);

// GET - display a system
router.get('/system/:id', systemController.showSystem);

// GET - create new system entry
router.get('/system/create', systemController.createSystemGET);

// POST - create new system entry
router.post('/system/create', systemController.createSystemPOST);

// GET - update system entry
router.get('/system/:id/update', systemController.updateSystemGET);

// POST - update system entry
router.post('/system/:id/update', systemController.updateSystemPOST);

// GET - delete a system
router.get('/system/:id/delete', systemController.deleteSystemGET);

// POST - delete a system
router.post('/system/:id/delete', systemController.deleteSystemPOST);

// ---------- Company Routes ----------

// GET - display all 
router.get('/companies', companyController.showAllCompanies);

// GET - show a company
router.get('/company/:id', companyController.showCompany);

// GET - create new company entry
router.get('/company/create', companyController.createCompanyGET);

// POST - create new company entry
router.post('/company/create', companyController.createCompanyPOST);

// GET - update company page
router.get('/company/:id/update', companyController.updateCompanyGET);

// POST - update company page
router.post('/company/:id/update', companyController.updateCompanyPOST);

// GET - delete company page
router.get('/company/:id/delete', companyController.deleteCompanyGET);

// POST - delete company page
router.post('/company/:id/delete', companyController.deleteCompanyPOST);

// ---------- Unit Routes ----------

// GET - display all 
router.get('/units', unitController.showAllUnits);

// GET - show a company
router.get('/unit/:id', unitController.showUnit);

// GET - create new company entry
router.get('/unit/create', unitController.createUnitGET);

// POST - create new company entry
router.post('/unit/create', unitController.createUnitPOST);

// GET - update company page
router.get('/unit/:id/update', unitController.updateUnitGET);

// POST - update company page
router.post('/unit/:id/update', unitController.updateUnitPOST);

// GET - delete company page
router.get('/unit/:id/delete', unitController.deleteUnitGET);

// POST - delete company page
router.post('/unit/:id/delete', unitController.deleteUnitPOST);

module.exports = router;
