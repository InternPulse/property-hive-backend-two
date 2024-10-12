import express from 'express';
import { addImage, deleteImage } from '../controllers/propertyImagesController.js';
import multer from 'multer';

const STATIC_FILE_DIRECTORY = process.env.STATIC_FILE_DIRECTORY;

const upload  = multer( { storage: multer.memoryStorage(), dest: `${STATIC_FILE_DIRECTORY}/images` } );

const propertyImagesRoutes = express.Router();

propertyImagesRoutes.delete('/properties/:propertyId/images/:imageId', deleteImage);

propertyImagesRoutes.post('/properties/:propertyId/images', upload.single('imageFile'), addImage);

export default propertyImagesRoutes;