const express = require('express');
const { getInvoices } = require('../controllers/invoiceController');
const router = express.Router();

router.get('/properties/:propertyId/invoices', getInvoices);

module.exports = router;
