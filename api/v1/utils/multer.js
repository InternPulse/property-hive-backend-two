import multer from "multer";
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const STATIC_FILE_DIRECTORY = process.env.STATIC_FILE_DIRECTORY;

// Set up Multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir;
        if (file.fieldname === 'propertyImage')  {
            dir = `./${STATIC_FILE_DIRECTORY}/images`;
        }
        else {
            dir = `./${STATIC_FILE_DIRECTORY}/documents`;
        }

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir); // Create directory if not exists
        }

        cb(null, dir);
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filename with timestamp
    }
});

// File filter to only allow image uploads
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed'), false);
    }
};

export const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'images') {
            // Apply the image filter only to 'images' field
            imageFilter(req, file, cb);
        } else {
            // Allow all files in 'documents' field
            cb(null, true);
        }
    },
}).fields([{ name: 'propertyImage', maxCount: 10 }, { name: 'propertyDocument', maxCount: 10 }]); // Accept multiple images, documents.