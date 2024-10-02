import express from 'express';
import { deleteDocument, addDocument, getDocument } from '../controllers/documentController.js';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const STATIC_FILE_DIRECTORY = process.env.STATIC_FILE_DIRECTORY;

const upload  = multer( { storage: multer.memoryStorage(), dest: `${STATIC_FILE_DIRECTORY}/documents` } );

const documentRoutes = express.Router();

documentRoutes.delete('/properties/:propertyId/documents', deleteDocument);

documentRoutes.post('/properties/:propertyId/documents', upload.single('documentFile'), addDocument);

documentRoutes.get('/properties/:propertyId/documents', getDocument)

export default documentRoutes;