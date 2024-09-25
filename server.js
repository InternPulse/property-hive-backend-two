import express from "express";
import { PrismaClient } from "@prisma/client";
import ratingRoutes from './api/v1/routes/ratingRoutes.js';
import propertyRoutes from "./api/v1/routes/propertyRoutes.js";
import documentRoutes from './api/v1/routes/documentRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API Routes
app.use('/api/v1/property-hive', ratingRoutes);
app.use("/api/v1/property-hive", propertyRoutes);
app.use("/api/v1/property-hive", documentRoutes);

async function main() {
    try {
        await prisma.$connect();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();

export default app; // Export app for use in tests


