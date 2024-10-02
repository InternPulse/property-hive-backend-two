import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import dotenv from 'dotenv';
import path from "path";

dotenv.config();

const STATIC_FILE_DIRECTORY = process.env.STATIC_FILE_DIRECTORY;

const BASE_URL = process.env.BASE_URL;

const prisma = new PrismaClient();

/**
 * 
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 * @returns - reutrn an empty array with OK status code (200)
 */
export const deleteImage = async (req, res) => {
    const { imageId } = req.params;

    try {
        const propertyImage =  await prisma.common_propertyimages.findFirst({
            where: {
                id: Number(imageId),
            }
        });

        if (!propertyImage) {
            return res.status(404).json({
                statusCode: 404,
                message: "Property Image Not Found",
            });
        }

        await prisma.common_propertyimages.delete({
            where: {
                id: Number(imageId)
            }
        });

        // Delete property image file from local disk.
        fs.unlink(`${STATIC_FILE_DIRECTORY}/images/${propertyImage.img.split('/')[propertyImage.img.split('/').length - 1]}`, (error) => {
            if (error) {
                throw Error(`Error during file remove: ${error.message}`);
            }
            console.log(`File Deleted Successfully`);
        });

        return res.status(200).json({
            statusCode: 200,
            message: `Image deleted Successfully`,
            data: [],
        });
    } catch(error) {
        return res.satus(500).json({
            statusCode: 500,
            message: 'An error occurred',
            error: error.message,
        })
    }
}

/**
 * 
 * @param {Request} req - Request Object
 * @param {Response} res - Response Object
 * @returns - return the image file information with CREATED status code (201)
 */
export const addImage = async (req, res) => {
    const { propertyId } = req.params;

    try {
        const imageFile = req.file;

        const property = await prisma.common_property.findFirst({
            where: {
                id: Number(propertyId)
            }
        });

        // Check if property exist or not.
        if (!property) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Property Not Found',
            });
        }

        const fileExtension = path.extname(imageFile.originalname);
        const fileName = `${Date.now()}${fileExtension}`;

        // Save the property image in the local dis at /static/images directory.
        fs.writeFile(`${STATIC_FILE_DIRECTORY}/images/${fileName}`, imageFile.buffer, (error) => {
            if (error) {
                throw new Error(error.message);
            } else {
                console.log('File saved successfully at', `/images/${fileName}`);
            }
        })

        // save Property Image info at the database.
        const propertyImage = await prisma.common_propertyimages.create({
            data: {
                propertyid_id: Number(propertyId),
                img: `${BASE_URL}/${STATIC_FILE_DIRECTORY}/images/${fileName}`
            }
        });

        return res.status(201).json({
            statusCode: 201,
            message: 'Property Image added successfully',
            data: propertyImage
        });
    } catch(error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'An error occurred',
            error: error.message
        });
    }
}