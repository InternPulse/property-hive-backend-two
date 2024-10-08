import prisma from "../../../DB/db.config.js";
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const STATIC_FILE_DIRECTORY = process.env.STATIC_FILE_DIRECTORY;

const BASE_URL = process.env.BASE_URL;

export const addProperty = async (req, res) => {
    const {
        sellerId,
        name,
        state,
        city,
        address,
        price,
        description,
        squaremeters,
        propertyType,
        numberOfBathrooms,
        numberOfBedrooms,
        payment_frequency,
        installment_duration,
        down_payment,
        installment_payment_price,
        keywords
    } = req.body;

    try {
        if (!sellerId ||
            !name ||
            !state ||
            !city ||
            !address ||
            !price ||
            !squaremeters ||
            !propertyType ||
            !payment_frequency ||
            !installment_duration ||
            !down_payment ||
            !installment_payment_price) {
            return res.status(400).json({
                statusCode: 400,
                message: `Missing required fields:
                sellerId: ${sellerId},
                name: ${name},
                state: ${state},
                city: ${city},
                address: ${address},
                price: ${price},
                squaremeters: ${squaremeters},
                propertyType: ${propertyType},
                payment_frequency: ${payment_frequency},
                installment_duration: ${installment_duration},
                down_payment: ${down_payment},
                installment_payment_price: ${installment_payment_price}`
            });
        }
        
        // Check if the sellerId exists in the User table
        const sellerExists = await prisma.common_user.findUnique({
            where: { id: Number(sellerId) }
        });

        if (!sellerExists) {
            return res.status(400).json({
                statusCode: 400,
                message: "Invalid sellerId: User (seller) does not exist"
            });
        }

        // Check if the property image provided.
        if (!req.files['propertyImage']) {
            return res.status(400).json({
                statusCode: 400,
                message: "Property Images is missing",
            });
        }

        // Create the new property
        const newProperty = await prisma.common_property.create({
            data: {
                sellerid_id: Number(sellerId), // Ensure sellerId is a string
                name,
                state,
                city,
                address,
                price: Number(price),
                description: description || null,
                squaremeters: String(squaremeters), // Ensure squaremeters is a string
                property_type: propertyType, // Map propertyType to property_type
                number_of_bathrooms: Number(numberOfBathrooms),
                number_of_bedrooms: Number(numberOfBedrooms),
                payment_frequency: String(payment_frequency),
                installment_duration: String(installment_duration),
                down_payment: down_payment,
                installment_payment_price: Number(installment_payment_price),
                keywords: keywords.split(' '),
                is_active: true,
            }
        });

        // Process images
        const imageUrls = [];
        const documentUrls = [];

        if (req.files['propertyImage'] && req.files['propertyImage'].length > 0) {
            req.files['propertyImage'].forEach(file => {
                const imageUrl = `${BASE_URL}/${STATIC_FILE_DIRECTORY}/images/${file.filename}`; // save full image URL
                imageUrls.push(imageUrl);
            });

            const propertyImages = imageUrls.map(imgURL => ({
                propertyid_id: newProperty.id,
                img: imgURL
            }));

            await prisma.common_propertyimages.createMany({
                data: propertyImages
            });
        }

        if (req.files['propertyDocument'] && req.files['propertyDocument'].length > 0) {
            req.files['propertyDocument'].forEach(file => {
                const documentUrl = `${BASE_URL}/${STATIC_FILE_DIRECTORY}/documents/${file.filename}`;
                documentUrls.push(documentUrl);
            });

            const propertyDocuments = documentUrls.map(documentURL => ({
                propertyid_id: newProperty.id,
                file_path: documentURL
            }));

            await prisma.common_propertydocuments.createMany({
                data: propertyDocuments
            });
        }
        // Seralize the id's from BigInt to Int
        // newProperty.id =  Number(newProperty.id);
        // newProperty.sellerid_id = Number(newProperty.sellerid_id);

        console.log(newProperty);

        return res.status(201).json({
            statusCode: 201,
            message: "Property added successfully",
            data: newProperty
        });

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            statusCode: 500,
            message:"Server error",
            error: error.message
        });
    }
};

export const getAllProperty = async (req, res) => {
    try {
        // Get page and limit from query parameters.
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10; 

        // Calculate the offset (number of records to skip)
        const skip = (page -1 ) * limit;

        let [properties, totalCount] = await Promise.all([
            prisma.common_property.findMany({
                skip: skip, // Skip base on page number
                take: limit, // Limit number of properties returned
                include: {
                    common_user: {
                        select: {
                            id: true,
                            email: true,
                            fname: true,
                            lname: true,
                            business_name: true,
                        }
                    },
                    common_propertyimages: {
                        select: {
                            id: true,
                            img: true,
                        }
                    }
                }
            }),
            prisma.common_property.count() // Get total count of properties
        ]);

        if (properties.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "No property has been listed"
            });
        }

        const totalPages = Math.ceil(totalCount / limit);

        // Send successful response
        return res.status(200).json({
            statusCode: 200,
            totalCount,
            page,
            limit,
            totalPages,
            properties
        });

    } catch (error) {
        console.error("Error fetching properties:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const searchAndFilter = async (req, res) => {
    try {
        const { city, name, keywords } = req.query;

        // Validate that only city, name, or keywords are provided
        const allowedQueryParams = ['city', 'name', 'keywords'];
        const queryParams = Object.keys(req.query);

        const invalidParams = queryParams.filter(param => !allowedQueryParams.includes(param));

        if (invalidParams.length > 0) {
            return res.status(400).json({
                statusCode: 400,
                message: `Invalid query parameter(s): ${invalidParams.join(', ')}. Allowed query parameters are: city, name, keywords.`,
            });
        }

        const searchFilters = {
            OR: [
                city ? { city: { contains: city, mode: 'insensitive' } } : undefined,
                name ? { name: { contains: name, mode: 'insensitive' } } : undefined,
                keywords ? { keywords: { has: keywords } } : undefined, // Use 'has' for arrays
            ].filter(Boolean), // Remove any undefined filters
        };
        // Fetch matching properties
        const properties = await prisma.common_property.findMany({
            where: searchFilters,
            include: {
                common_propertyimages: true,
            },
        });

        if (properties.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'No properties found matching the search criteria',
            });
        }

        return res.status(200).json({
            statusCode: 200,
            message: 'Search retrieved successfully',
            data: properties,
        });

    } catch (error) {
        console.error('Error in searchAndFilter:', error);
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error',
            error: error.message,
        });
    }
};



export const getSingleProperty = async (req, res) => {
    try {
        const propertyId = parseInt(req.params.propertyId); // Ensure the propertyId is an integer

        const property = await prisma.common_property.findUnique({
            where: {
                id: Number(propertyId)
            },
            include: {
                common_user: { 
                    select: {
                        id: true,
                        email: true,
                        fname: true,
                        lname: true,
                        business_name: true
                    }
                },
                common_ratings: {
                    select: {
                        id: true,
                        rate: true, 
                        comment: true,
                        common_user: {
                            select: {
                                id: true,
                                fname: true, 
                                lname: true 
                            }
                        }
                    }
                },
                common_propertyimages: {
                    select: {
                        id: true,
                        img: true
                    }
                },
                common_propertydocuments: {
                    select: {
                        id: true,
                        file_path: true,
                        
                    }
                }
            }
        });

        if (!property) {
            return res.status(404).json({
                statusCode: 404,
                message: "Property not found"
            });
        }

        // Seralize the id's from BigInt to Int

        // property.id = Number(property.id);
        // property.sellerid_id = Number(property.sellerid_id);
        // property.common_user.id = Number(property.common_user.id);

        // for (let rating of property.common_ratings) {
        //     rating.id = Number(rating.id);
        //     rating.common_user.id = Number(rating.common_user.id);
        // }

        // for (let propertyImg of property.common_propertyimages) {
        //     propertyImg.id = Number(propertyImg.id);
        // }

        console.log(property)
        return res.status(200).json({
            statusCode: 200,
            message: "Property retrieved successfully",
            data: property
        });

    } catch (error) {
        console.error("Error retrieving property:", error); // Log the error
        return res.status(500).json({
            statusCode: 500,
            message: "Internal server error", // More user-friendly message
            error: error.message
        });
    }
};

export const updateProperty = async (req, res) => {
    const propertyId = req.params.id;
    // const { sellerId, name, state, city, address, price, description, squaremeters, propertyType, is_sold } = req.body;

    const {
        sellerId,
        name,
        state,
        city,
        address,
        price,
        description,
        squaremeters,
        propertyType,
        is_sold,
        numberOfBathrooms,
        numberOfBedrooms,
        payment_frequency,
        installment_duration,
        down_payment,
        installment_payment_price,
        keywords
    } = req.body;

    try {
        const findProperty = await prisma.common_property.findUnique({
            where: { id: Number(propertyId) }
        });

        if (!findProperty) {
            return res.status(404).json({
                statusCode: 404,
                message: "Property not found"
            });
        }

        // Update the property details
        const updatedProperty = await prisma.common_property.update({
            where: { id: Number(propertyId) },
            data: {
                sellerid_id: sellerId ? Number(sellerId) : findProperty.sellerId, // Ensure sellerId is String
                name: name || findProperty.name,
                state: state || findProperty.state,
                city: city || findProperty.city,
                address: address || findProperty.address,
                price: price ? Number(price) : findProperty.price,
                description: description || findProperty.description,
                squaremeters: squaremeters ? String(squaremeters) : findProperty.squaremeters, // Use lowercase 'squaremeters'
                property_type: propertyType || findProperty.property_type, // Ensure propertyType matches your schema
                is_sold: is_sold ? Boolean(is_sold) : findProperty.is_sold,
                number_of_bathrooms: numberOfBathrooms ? Number(numberOfBathrooms) : findProperty.numberOfBathrooms,
                number_of_bedrooms: numberOfBedrooms ? Number(numberOfBedrooms) : findProperty.numberOfBedrooms,
                payment_frequency: payment_frequency || findProperty.payment_frequency,
                installment_duration: installment_duration || findProperty.installment_duration,
                down_payment: down_payment || findProperty.down_payment,
                installment_payment_price: Number(installment_payment_price) || findProperty.installment_payment_price,
                keywords: keywords === undefined ? findProperty.keywords : keywords.split(' '),
            }
        });

        // If new images are provided, update them in the PropertyImages model
        // if (images && images.length > 0) {
        //     // First, delete the existing images for this property
        //     await prisma.common_propertyimages.deleteMany({
        //         where: { propertyid_id: Number(propertyId) }
        //     });
            
        //     const propertyImages = images.map(img => ({
        //         propertyid_id: updatedProperty.id,
        //         img
        //     }));

        //     await prisma.common_propertyimages.createMany({
        //         data: propertyImages
        //     });
        // }

        console.log(updatedProperty);
        
        // Seralize the id's from BigInt to Int
        
        // updatedProperty.id = Number(updatedProperty.id);
        // updatedProperty.sellerid_id = Number(updatedProperty.sellerid_id);

        return res.status(200).json({
            statusCode: 200,
            message: "Property updated successfully",
            data: updatedProperty
        });

    } catch (error) {
        console.error("Error updating property:", error); // Log the error for debugging
        return res.status(500).json({
            statusCode: 500,
            message: "Server error", error: error.message
        });
    }
};

export const deleteProperty = async (req, res) => {
    const propertyId = req.params.id;

    try {
        // Find the property by ID
        const findProperty = await prisma.common_property.findUnique({
            where: { id: Number(propertyId) },
            include: {
                common_propertyimages: true,
                common_propertydocuments: true
            }
        });

        if (!findProperty) {
            return res.status(404).json({
                statusCode: 404,
                message: "Property not found"
            });
        }

        // Get the current directory path.
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        // Delete the images from the filesystem
        const deleteImageFiles = findProperty.common_propertyimages.map(image => {
            // remove upload to static
            const imagePath = path.join(__dirname, '..', '..', '..', `${STATIC_FILE_DIRECTORY}`, 'images', image.img.split('/')[image.img.split('/').length - 1]); // Full path to the image
            return new Promise((resolve, reject) => {
                fs.unlink(`${STATIC_FILE_DIRECTORY}/images/${image.img.split('/')[image.img.split('/').length - 1]}`, (err) => {
                    if (err) {
                        // Ignore if file doesn't exist.
                        console.log(`Failed to delete an image file: ${imagePath}`);
                        return reject(err);
                    }
                    resolve();
                });
            });
        });


        // Delete the images from the filesystem
        const deleteDocumentFiles = findProperty.common_propertydocuments.map(document => {
            // remove upload to static
            const documentPath = path.join(__dirname, '..', '..', '..', `${STATIC_FILE_DIRECTORY}`, 'documents', document.file_path.split('/')[document.file_path.split('/').length - 1]); // Full path to the document
            return new Promise((resolve, reject) => {
                fs.unlink(`${STATIC_FILE_DIRECTORY}/documents/${document.file_path.split('/')[document.file_path.split('/').length - 1]}`, (err) => {
                    if (err) {
                        // Ignore if file doesn't exist.
                        console.log(`Failed to delete an document file: ${documentPath}`);
                        return reject(err);
                    }
                    resolve();
                });
            });
        });

        // Wait for all images to be deleted from disk
        await Promise.all(deleteImageFiles);
        
        // Wait for all images to be deleted from disk
        await Promise.all(deleteDocumentFiles);

        // Delete related PropertyImages
        await prisma.common_propertyimages.deleteMany({
            where: { propertyid_id: Number(propertyId) }
        });

        // Delete related PropertyDocuments
        await prisma.common_propertydocuments.deleteMany({
            where: { propertyid_id: Number(propertyId) }
        });

        // Delete related SoldProperties (if any)
        await prisma.common_soldproperties.deleteMany({
            where: { propertyid_id: Number(propertyId) }
        });

        // Delete related Transactions (if any)
        await prisma.common_transactions.deleteMany({
            where: { propertyid_id: Number(propertyId) }
        });

        // Finally, delete the property itself
        await prisma.common_property.delete({
            where: { id: Number(propertyId) }
        });

        // Seralize the id's from BigInt to Int
        // findProperty.id = Number(findProperty.id);
        // findProperty.sellerid_id = Number(findProperty.sellerid_id);

        return res.status(200).json({
            statusCode: 200,
            message: "Property and its related data deleted successfully",
            deletedProperty: findProperty // Optionally include deleted property details
        });

    } catch (error) {
        console.error("Error deleting property:", error); // Log the error for debugging
        return res.status(500).json({
            statusCode: 500,
            message: "Server error",
            error: error.message
        });
    }
};
