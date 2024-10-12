import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import path from "path";
import dotenv from 'dotenv';

dotenv.config();

const STATIC_FILE_DIRECTORY = process.env.STATIC_FILE_DIRECTORY;

const BASE_URL = process.env.BASE_URL;

const prisma = new PrismaClient();

export const deleteDocument = async (req, res) => {
    const { propertyId } = req.params;

    try {
        let propertyDocument = await prisma.common_propertydocuments.findFirst({
            where: {
                propertyid_id: Number(propertyId)
            }
        })

        if (!propertyDocument) {
            return res.status(404).json({
                statusCode: 404,
                message: "Property Document Not Found",
            });
        }

        await prisma.common_propertydocuments.deleteMany({
            where: {
                propertyid_id: Number(propertyId),
            },
        });
        // Delete property document file from local disk.
        fs.unlink(`${STATIC_FILE_DIRECTORY}/documents/${propertyDocument.file_path.split('/')[propertyDocument.file_path.split('/').length - 1]}`, (error) => { // getting document file name and path
            if (error) {
                throw new Error(`Error during file remove: ${error.message}`);
            }
            console.log('File Deleted Successfully');
        });

        // Seralize the id's from BigInt to Int
        // propertyDocument.id = Number(propertyDocument.id)
        // propertyDocument.propertyid_id = Number(propertyDocument.propertyid_id);

        return res.status(200).json({
            statusCode: 200,
            message: 'Document(s) deleted successfully',
            data: [],
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'An error occurred',
            error: error.message,
        });
    }
};

/**
 * Create property document for a specific property.
 * @param {Request} req - Request Object 
 * @param {Response} res - Response Object 
 * @returns - return the new property document data with 201 status code.
 */
export const addDocument = async (req, res) => {
    const { propertyId } = req.params;

    try {
        const {
            documentType
        } = req.body;

        const documentFile = req.file;

        // Check if property document exist or not.
        if (!(await prisma.common_property.findFirst({
            where: {
                id: Number(propertyId),
            }
        }))) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Property not found',
            });
        }

        console.log(documentFile);

        // Validte document data.
        if (typeof documentType !== 'string' || !documentFile) {
            return res.status(400).json({
                statusCode: 400,
                message: `The provided fileds are not valid`
            });
        }

        const fileExtension = path.extname(documentFile.originalname);        
        const fileName = `${Date.now()}${fileExtension}`;

        // Save the property document in the local disk at /static/documents directory.
        fs.writeFile(`${STATIC_FILE_DIRECTORY}/documents/${fileName}`, documentFile.buffer, { encoding: 'utf-8' }, (error) => {
            if (error) {
                throw new Error(error.message);
            } else {
                console.log('File saved successfully at', `/documents/${fileName}`);
            }
        })

        // Save Property Document info at the database.
        const propertyDocument = await prisma.common_propertydocuments.create({
            data: {
                propertyid_id: Number(propertyId),
                document_type: documentType,
                file_path: `${BASE_URL}/${STATIC_FILE_DIRECTORY}/documents/${fileName}`,
            }
        });

        // Seralize the id's from BigInt to Int
        // propertyDocument.id = Number(propertyDocument.id);
        // propertyDocument.propertyid_id = Number(propertyDocument.propertyid_id);

        return res.status(201).json({
            statusCode: 201,
            message: 'Property Document added successfully',
            data: propertyDocument,
        });
    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            statusCode: 500,
            message: 'An error occurred',
            error: error.message
        });
    }
}

/**
 * Retrieve property document for a specific property.
 * @param {Request} req - Request Object 
 * @param {Response} res - Response Object
 * @returns - return the property doucmnet based on propertyId. 
 */
export const getDocument = async (req, res) => {
    const { propertyId } = req.params;

    try {
        // Check if the property document exist or not.
        if (!(await prisma.common_propertydocuments.findFirst({
            where: {
                propertyid_id: Number(propertyId)
            }
        }))) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Property Document not found',
            });
        }

        // Retrieve property document from the database.
        const propertyDocument = await prisma.common_propertydocuments.findFirst({
            where: {
                propertyid_id: Number(propertyId),
            }
        });

        const fileName = propertyDocument.file_path.split('/')[propertyDocument.file_path.split('/').length - 1];

        const filePath  = `${STATIC_FILE_DIRECTORY}/documents/${fileName}`;
        
        // Read the property document data.
        fs.stat(filePath, (error, stats) => {
            if (error || !stats.isFile()) {
                console.log(error.message)
                return res.status(404).json({
                    statusCode: 404,
                    message: 'An error occurred or the property document doesn\'t exist'
                });
            }

            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            res.setHeader('Content-Type', 'application/octet-stream');

            const readStream = fs.createReadStream(filePath);

            // Return property document content.
            readStream.pipe(res.status(200));
        });

    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            statusCode: 500,
            message: 'An error occurred',
            error: error.message,
        })
    }
}