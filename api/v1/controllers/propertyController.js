import prisma from "../../../DB/db.config.js";

export const addProperty = async (req, res) => {
    const { sellerId, name, state, city, address, price, description, squaremeters, propertyType, images } = req.body;

    try {
        // Check if the sellerId exists in the User table
        const sellerExists = await prisma.user.findUnique({
            where: { id: sellerId }
        });

        if (!sellerExists) {
            return res.status(400).json({ message: "Invalid sellerId: User does not exist" });
        }

        if (!name || !state || !city || !address || !price || !squaremeters || !propertyType) {
            return res.status(400).json({ message: "Missing required fields: sellerId, name, state, city, address, price, squaremeters, propertyType" });
        }

        // Create the new property
        const newProperty = await prisma.property.create({
            data: {
                sellerId: Number(sellerId), // Ensure sellerId is a string
                name,
                state,
                city,
                address,
                price: Number(price),
                description: description || null,
                squaremeters: String(squaremeters), // Ensure squaremeters is a string
                property_type: propertyType // Map propertyType to property_type
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
        console.log(error.message)
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllProperty = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page)) || 1; 
        const limit = Math.max(1, parseInt(req.query.limit)) || 10; 

        const [properties, totalCount] = await Promise.all([
            prisma.property.findMany({
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    seller: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            businessName: true,
                        }
                    },
                    propertyImages: {
                        select: {
                            id: true,
                            img: true,
                        }
                    }
                }
            }),
            prisma.property.count() // Get total count of properties
        ]);

        if (properties.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No property has been listed"
            });
        }

        // Send successful response
        return res.status(200).json({
            status: 200,
            totalCount,
            page,
            limit,
            properties
        });

    } catch (error) {
        console.error("Error fetching properties:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const searchAndFilter = async (req, res) => {
    try {
      const {state, city, property_type, minPrice, maxPrice, squaremeters, searchTerm} = req.query;

      const searchFilters = {
        // properties are to meet conditions of specified filters in AND condition to be displayed
        AND: [
            state ? {state: {contains: state, mode: 'insensitive'}} : undefined,
            city ? {city: {contains: city, mode: 'insensitive'}} : undefined,
            property_type ? {property_type: {contains: property_type, mode: 'insensitive'}} : undefined,
            squaremeters ? {squaremeters: {contains: squaremeters, mode: 'insensitive'}} : undefined,
            minPrice || maxPrice ? {
                price: {
                    ...(minPrice ? {gte: Number(minPrice)} : {}),
                    ...(maxPrice ? {lte: Number(maxPrice)} : {}),
                }
            } : undefined,
            //If search input contains any keyword that happens to appear in the name, description or address, 
            //then the "searchTerm" will ensure it(the property) is displayed
            searchTerm ? {
                //property doesn't have to meet all conditions
                OR: [
                    {name: {contains: searchTerm, mode: 'insensitive'}},
                    {description: {contains: searchTerm, mode: 'insensitive'}},
                    {address: {contains: searchTerm, mode: 'insensitive'}}
                ]
            } : undefined,
        ].filter(Boolean) // removes any undefined values from the AND array
      }
      const properties = await prisma.property.findMany({
        where: {
            ...searchFilters
        }
      });
  
      return res.status(200).json({
        status: 200,
        message: 'Search retrieved successfully',
        data: properties,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Error searching properties',
        error: error.message
      });
    }
  };

export const getSingleProperty = async (req, res) => {
    try {
        const propertyId = parseInt(req.params.propertyId); // Ensure the propertyId is an integer

        const property = await prisma.property.findUnique({
            where: {
                id: Number(propertyId)
            },
            include: {
                seller: { 
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        businessName: true
                    }
                },
                ratings: {
                    select: {
                        id: true,
                        rate: true, 
                        comment: true,
                        user: {
                            select: {
                                id: true,
                                firstName: true, 
                                lastName: true 
                            }
                        }
                    }
                },
                propertyImages: {
                    select: {
                        id: true,
                        img: true
                    }
                }
            }
        });

        if (!property) {
            return res.status(404).json({
                status: 404,
                message: "Property not found"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Property retrieved successfully",
            data: property
        });
    } catch (error) {
        console.error("Error retrieving property:", error); // Log the error
        return res.status(500).json({
            status: 500,
            message: "Internal server error", // More user-friendly message
            error: error.message
        });
    }
};

export const updateProperty = async (req, res) => {
    const propertyId = req.params.id;
    const { sellerId, name, state, city, address, price, description, squaremeters, propertyType, images } = req.body;

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
                sellerId: sellerId ? Number(sellerId) : findProperty.sellerId, // Ensure sellerId is String
                name: name || findProperty.name,
                state: state || findProperty.state,
                city: city || findProperty.city,
                address: address || findProperty.address,
                price: price ? Number(price) : findProperty.price,
                description: description || findProperty.description,
                squaremeters: squaremeters ? Number(squaremeters) : findProperty.squaremeters, // Use lowercase 'squaremeters'
                property_type: propertyType || findProperty.property_type // Ensure propertyType matches your schema
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
        console.error("Error updating property:", error); // Log the error for debugging
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
        await prisma.soldProperties.deleteMany({
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
            message: "Property and its related data deleted successfully",
            deletedProperty: findProperty // Optionally include deleted property details
        });

    } catch (error) {
        console.error("Error deleting property:", error); // Log the error for debugging
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};






