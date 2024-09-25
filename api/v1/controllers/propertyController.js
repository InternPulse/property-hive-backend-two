import prisma from "../../../DB/db.config.js";

export const addProperty = async (req, res) => {
    const { sellerId, name, state, city, address, price, description, squareMeters, propertyType, images } = req.body;

    try {
        
        if (!sellerId || !name || !state || !city || !address || !price || !squareMeters || !propertyType) {
            return res.status(400).json({ message: "Missing required fields: sellerId, name, state, city, address, price, squareMeters, propertyType" });
        }

        // Create the new property
        const newProperty = await prisma.property.create({
            data: {
                sellerId: Number(sellerId),
                name,
                state,
                city,
                address,
                price: Number(price),
                description: description || null,
                squareMeters: Number(squareMeters),
                propertyType
            }
        });

        
        if (images && images.length > 0) {
            const propertyImages = images.map(img => ({
                propertyId: newProperty.id,
                img
            }));

            await prisma.propertyImages.createMany({
                data: propertyImages
            });
        }

        return res.status(200).json({
            message: "Property added successfully",
            data: newProperty
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getAllProperty = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const properties = await prisma.property.findMany({
            skip: (page - 1) * limit,
            take: parseInt(limit)
        });

        if(properties.length == 0) {
            return res.status(404).json({
                status: 404,
                message: "No property has been listed"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Property list retrieved Successfully",
            propertyPerPage: `${properties.length} properties available`,
            pageNumber: page,
            limit: limit,
            data: properties
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

export const getSingleProperty = async (req, res) => {
    try {
        const propertyId = req.params.propertyId

        const property = await prisma.property.findUnique({
            where: {
                id: propertyId
            },
            include: {
                Rating: {
                    select: { id: true,
                        rating: true,
                        comment: true,
                        user: {
                            select: {id: true, firtName: true, lastname: true}
                        }
                    }
                }
            }
        });

        if(!property) {
            return res.status(404).json({
                status: 404,
                message: "Property not found"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Property retrieved Successfully",
            data: property
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};

export const updateProperty = async (req, res) => {
    const propertyId = req.params.id;
    const { sellerId, name, state, city, address, price, description, squareMeters, propertyType, images } = req.body;

    try {
        
        const findProperty = await prisma.property.findUnique({
            where: { id: Number(propertyId) }
        });

        if (!findProperty) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Update the property details
        const updatedProperty = await prisma.property.update({
            where: { id: Number(propertyId) },
            data: {
                sellerId: sellerId ? Number(sellerId) : findProperty.sellerId,
                name: name || findProperty.name,
                state: state || findProperty.state,
                city: city || findProperty.city,
                address: address || findProperty.address,
                price: price ? Number(price) : findProperty.price,
                description: description || findProperty.description,
                squareMeters: squareMeters ? Number(squareMeters) : findProperty.squareMeters,
                propertyType: propertyType || findProperty.propertyType
            }
        });

        // If new images are provided, update them in the PropertyImages model
        if (images && images.length > 0) {
            // First, delete the existing images for this property
            await prisma.propertyImages.deleteMany({
                where: { propertyId: Number(propertyId) }
            });

        
            const propertyImages = images.map(img => ({
                propertyId: updatedProperty.id,
                img
            }));

            await prisma.propertyImages.createMany({
                data: propertyImages
            });
        }

        return res.status(200).json({
            message: "Property updated successfully",
            data: updatedProperty
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const deleteProperty = async (req, res) => {
    const propertyId = req.params.id;

    try {
        // Find the property by ID
        const findProperty = await prisma.property.findUnique({
            where: { id: Number(propertyId) }
        });

        if (!findProperty) {
            return res.status(404).json({ message: "Property not found" });
        }

        // Delete related PropertyImages
        await prisma.propertyImages.deleteMany({
            where: { propertyId: Number(propertyId) }
        });

        // Delete related PropertyDocuments
        await prisma.propertyDocuments.deleteMany({
            where: { propertyId: Number(propertyId) }
        });

        // Delete related SoldProperties (if any)
        await prisma.soldproperties.deleteMany({
            where: { propertyId: Number(propertyId) }
        });

        // Delete related Transactions (if any)
        await prisma.transactions.deleteMany({
            where: { propertyId: Number(propertyId) }
        });

        // Finally, delete the property itself
        await prisma.property.delete({
            where: { id: Number(propertyId) }
        });

        return res.status(200).json({
            message: "Property and its related data deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};



