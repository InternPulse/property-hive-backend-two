
import express from "express";
import { PrismaClient } from "@prisma/client";
import ratingRouter from './api/v1/routes/rating.js'
import propertyRoutes from "./api/v1/routes/propertyRoutes.js
import dotenv from 'dotenv'
import routes from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

const prisma = new PrismaClient()

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// API Routes
app.use('/api/v1/property-hive', ratingRouter);
app.use("/api/v1/property", propertyRoutes); 

async function main () {
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`);
    });
  app.use(routes);
}

main()
.then(async () => {

    // Connect to database
    await prisma.$connect();

}).catch(async (error) => {

    await prisma.$disconnect();
    process.exit(1);

});
