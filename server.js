import express from "express";
import { PrismaClient } from "@prisma/client";
import ratingRoutes from './api/v1/routes/ratingRoutes.js';
import propertyRoutes from "./api/v1/routes/propertyRoutes.js";
import documentRoutes from './api/v1/routes/documentRoutes.js';
import invoiceRouter from "./api/v1/routes/invoiceRoutes.js";
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const STATIC_FILE_DIRECTORY = process.env.STATIC_FILE_DIRECTORY;

const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve the static files
app.use(`/${STATIC_FILE_DIRECTORY}/images`, express.static(`${STATIC_FILE_DIRECTORY}/images`));
app.use(`/${STATIC_FILE_DIRECTORY}/documents`, express.static(`${STATIC_FILE_DIRECTORY}/documents`));

// API Routes
app.use('/api/v1', ratingRoutes);
app.use("/api/v1", propertyRoutes);
app.use("/api/v1", documentRoutes);
app.use("/api/v1", invoiceRouter);


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


