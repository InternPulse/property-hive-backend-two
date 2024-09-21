const express = require('express');
const { deleteDocument } = require('../controllers/documentController');
const router = express.Router();

router.delete('/properties/:propertyId/documents', deleteDocument);

module.exports = router;
