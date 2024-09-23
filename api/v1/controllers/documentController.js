import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const deleteDocument = async (req, res) => {
    const { propertyId } = req.params;

    try {
        await prisma.propertyDocument.deleteMany({
            where: {
                propertyId: parseInt(propertyId),
            },
        });
        res.status(200).json({
            statusCode: 200,
            message: 'Document(s) deleted successfully',
            data: [],
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'An error occurred',
            error: error.message,
        });
    }
};


export const addDocument = async (req, res) => {
    const { propertyId } = req.params;

    try {
        // Get document data from request body
        const { documentFile, documentType } = req.body;

        // Check if the property exist.
        if (!(await prisma.property.findFirst({
            where: {
                id: propertyId,
            }
        }))) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Property not found',
                data: []
            })
        }

        // add property document to the database.
        const propertyDocument = await prisma.property.create({
            data: {
                documentFile,
                documentType
            }
        });

        return res.status(201).json({
            statusCode: 201,
            message: 'Document added successfully',
            data: propertyDocument,
        });
    } catch(error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'An error occurred',
            error: error.message,
        });
    } 
}

export const getDocument = async (req, res) => {
    const { propertyId } = req.params;

    try {
        // Check if the property exist.
        if (!(await prisma.property.findFirst({
            where: {
                id: propertyId,
            }
        }))) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Property not exist'
            });
        }

        // get document by property id
        const propertyDocument = await prisma.propertyDocument.findFirst({
            where: {
                propertyId: parseInt(propertyId)
            }
        });

        return res.status(200).json({
            statusCode: 200,
            message: 'Document retrieved successfully',
            data: propertyDocument
        });
    } catch(error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'An error occurred',
            error: error.message
        });
    }
}