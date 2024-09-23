import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getInvoices = async (req, res) => {
    const { propertyId } = req.params;

    try {
        const invoices = await prisma.invoice.findMany({
            where: {
                transactionId: parseInt(propertyId),
            },
        });

        res.status(200).json({
            statusCode: 200,
            message: 'Invoices retrieved successfully',
            data: invoices,
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'An error occurred',
            error: error.message,
        });
    }
};