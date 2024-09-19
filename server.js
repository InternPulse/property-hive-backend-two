
import express from "express";
import { PrismaClient } from "@prisma/client";
import ratingRouter from './api/v1/routes/rating.js';
import propertyRoutes from "./api/v1/routes/propertyRoutes.js";
import dotenv from 'dotenv';
import routes from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000; 

const prisma = new PrismaClient();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API Routes
app.use('/api/v1/property-hive', ratingRouter);
app.use("/api/v1/property", propertyRoutes);
app.use(routes); 

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

