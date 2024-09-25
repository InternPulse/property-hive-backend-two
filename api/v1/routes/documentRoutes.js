// const express = require('express');
// const { deleteDocument } = require('../controllers/documentController');

import express from 'express';
import { deleteDocument, addDocument, getDocument } from '../controllers/documentController.js';
import multer from 'multer';

const upload  = multer( { storage: multer.memoryStorage(), dest: 'tmp/' } );

const documentRoutes = express.Router();

documentRoutes.delete('/properties/:propertyId/documents', deleteDocument);

documentRoutes.post('/properties/:propertyId/documents', upload.single('file'), addDocument);

documentRoutes.get('/properties/:propertyId/documents', getDocument)

export default documentRoutes;