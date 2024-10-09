import prisma from "../../../DB/db.config.js";

/**
 * purchasing property by property id
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @returns - return the transaction details and success message (200)
 */
export const purchaseProperty = async (req, res) => {
    const {
        propertyId,
        userId,
        paymentMethod,
        totalAmount
    } = req.body;

    if (!propertyId || !userId || !paymentMethod || !totalAmount) {
        return res.status(400).json({
            statusCode: 500,
            message: `
                Missing required fileds:
                propertyId: ${propertyId}
                userId: ${userId}
                paymentMethod: ${paymentMethod}
                totalAmount: ${totalAmount}
                `
        });
    }

    // Validate incoming data type
    if (typeof paymentMethod !== 'string' || typeof totalAmount !== 'number') {
        return res.status(400).json({
            statusCode: 400,
            message: `
                the following data are not valid: { paymentMethod: string, totalAmount: number }
            `});
    }

    try {
        // Get property by id
        const property = await prisma.common_property.findUnique({
            where: { id: propertyId }
        });
        const user = await prisma.common_user.findUnique({
            where: { id: userId }
        });

        // Check if buyer user exist on the database.
        if  (!user) {
            await res.status(404).json({ statusCode: 404, message: 'user (buyer) not exists to purchase a property' });
        }

        // Check if the property exist, and are not active
        if (!property || !property.is_active)
            return res.status(404).json({ statusCode: 404, message: 'Property not found' });

        // Check if the property is available
        if (property.is_sold)
            return res.status(400).json({ statusCode: 400, message: 'Property is already sold' });

        // Create new transaction
        const transaction = await prisma.common_transactions.create({
            data: {
                userid_id: userId,
                propertyid_id: propertyId,
                payment_method: paymentMethod,
                total_amount: totalAmount,
                status: 'P' // 'P' : 'Pending'
            },
        })

        // Mark the property as sold
        await prisma.common_property.update({
            where: { id: propertyId },
            data: {
                is_sold: true,
                date_sold: new Date()
            }
        })

        return res.status(200).json({
            statusCode: 200,
            message: 'Property purhased suessfully',
            data: transaction
        });
    } catch(error) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}