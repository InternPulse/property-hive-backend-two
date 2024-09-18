const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { ratingRouter } = require('./api/v1/routes/rating');

const prisma = new PrismaClient()

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// API Routes
app.use('/api/v1/property-hive', ratingRouter);


app.get('/*', (req, res) => {
    res.status(404).json({
        error: 'Not Found'
    });
});

async function main () {
    app.listen(5000, () => {
        console.log('server running on port 5000');
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