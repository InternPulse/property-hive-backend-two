// const express = require('express');
// const { deleteDocument } = require('../controllers/documentController');

import express from 'express';
import { deleteDocument, getDocument, addDocument } from '../controllers/documentController';

const documentRoutes = express.Router();

documentRoutes.delete('/properties/:propertyId/documents', deleteDocument);

documentRoutes.get('/properties/:propertyId/documents', getDocument);

documentRoutes.post('/properties/:propertyId/documents', addDocument);


export default documentRoutes;
