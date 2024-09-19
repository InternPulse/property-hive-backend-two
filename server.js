import express from "express";
import { PrismaClient } from "@prisma/client";
import ratingRouter from './api/v1/routes/rating.js'
import dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT;

const prisma = new PrismaClient()

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API Routes
app.use('/api/v1/property-hive', ratingRouter);

async function main () {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });
}

main()
.then(async () => {

    // Connect to database
    await prisma.$connect();

}).catch(async (error) => {

    await prisma.$disconnect();
    process.exit(1);

});