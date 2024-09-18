import prisma from "../../../DB/db.config.js";


import { PrismaClient } from '@prisma/client';



export const addProperty = async (req, res) => {
    const { name, location, price, status, description, features, image } = req.body;

    try {
    
        if (!name || !location || !price || !status) {
            return res.status(400).json({ message: "Missing required fields: name, location, price, status" });
        }

        const findProperty = await prisma.property.findUnique({
            where: {
                name: name,  
            }
        });

    
        if (findProperty) {
            return res.status(400).json({ message: "Property already exists" });
        }

        // Create a new property
        const newProperty = await prisma.property.create({
            data: {
                name: name,
                location: location,
                price: Number(price),
                status: status,
                description: description,
                features: features.split(','),  
                image: image || null
            }
        });

        
        return res.status(200).json({
            message: "Property created successfully",
            data: newProperty
        });

    } catch (error) {
    
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateProperty = async (req, res) => {
    const propertyId = req.params.id;
    const { name, location, price, status, description, features, image } = req.body;

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
                name,
                location,
                price: Number(price), 
                status,
                description,
                features: features.split(','), 
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

        // Delete the property
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
