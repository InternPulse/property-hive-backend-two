const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.deleteDocument = async (req, res) => {
    const { propertyId } = req.params;

    try {
        await prisma.propertyDocument.deleteMany({
            where: {
                propertyId: parseInt(propertyId),
            },
        });
        res.status(200).json({
            statusCode: 200,
            message: 'Document(s) deleted successfully',
            data: [],
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'An error occurred',
            error: error.message,
        });
    }
};
