import prisma from "../../../DB/db.config.js";

export const addProperty = async (req, res) => {
    const { sellerID, location, price, description, squareMeters, propertyType, image } = req.body;

    try {
        if (!sellerID || !location || !price || !squareMeters) {
            return res.status(400).json({ message: "Missing required fields: sellerID, location, price, squareMeters" });
        }

        const newProperty = await prisma.property.create({
            data: {
                sellerID: Number(sellerID),
                location: location,
                price: Number(price),
                description: description || null,
                squareMeters: Number(squareMeters),
                propertyType: propertyType || null,
                image: image || null
            }
        });

        return res.status(200).json({
            message: "Property added successfully",
            data: newProperty
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateProperty = async (req, res) => {
    const propertyId = req.params.id;
    const { sellerID, location, price, description, squareMeters, propertyType, image } = req.body;

    try {
        const findProperty = await prisma.property.findUnique({
            where: { id: Number(propertyId) }
        });

        if (!findProperty) {
            return res.status(404).json({ message: "Property not found" });
        }

        const updatedProperty = await prisma.property.update({
            where: { id: Number(propertyId) },
            data: {
                sellerID: sellerID ? Number(sellerID) : findProperty.sellerID,
                location: location || findProperty.location,
                price: price ? Number(price) : findProperty.price,
                description: description || findProperty.description,
                squareMeters: squareMeters ? Number(squareMeters) : findProperty.squareMeters,
                propertyType: propertyType || findProperty.propertyType,
                image: image || findProperty.image
            }
        });

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
        const findProperty = await prisma.property.findUnique({
            where: { id: Number(propertyId) }
        });

        if (!findProperty) {
            return res.status(404).json({ message: "Property not found" });
        }

        await prisma.property.delete({
            where: { id: Number(propertyId) }
        });

        return res.status(200).json({
            message: "Property deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


