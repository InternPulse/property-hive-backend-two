// const express = require('express');
// const { deleteDocument } = require('../controllers/documentController');

import express from 'express';
import { deleteDocument } from '../controllers/documentController.js';

const documentRoutes = express.Router();

documentRoutes.delete('/properties/:propertyId/documents', deleteDocument);

export default documentRoutes;