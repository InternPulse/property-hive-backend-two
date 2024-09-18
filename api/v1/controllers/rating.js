// import prisma from '../../../server';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class RatingController {
    /**
     * @param {Request} req 
     * @param {Response} res
     * @return {Response} - return list of ratings for specific property with status code (200).
     * Success Responses:
     *      {
     *          data[],
     *          message
     *      }
     * Error Responses:
     *      {
     *           message
     *      }
     */
    static async getRatings(req, res) {
        try {
            // Get property id form url params.
            const { propertyId } = req.params;


            // Check if the property ratings exist at or not
            if ((await prisma.rating.findMany({ where: { id: propertyId } })).length === 0) {
                return res.status(404).json({
                    message: 'rating not found'
                });
            }

            // Get all ratings for specific property.
            const ratings = await prisma.rating.findMany({
                where: {
                    id: propertyId,
                }
            });

            // Return list of ratings.
            return res.status(200).json({
                data: [ratings],
                message: "Success"
            });
        } catch(error) {
            // Return Internal Server Error (500).
            return res.status(500).json({
                message: error.message
            });
        }
    }

    /**
     * @param {Request} req  - Request Object
     * @param {Response} res - Response Object
     * @return {Response} - return the updated rating with status code (200).
     * Success Responses:
     *      {
     *          updatedData,
     *          message
     *      }
     * Error Responses:
     *      {
     *           message
     *      }
     */ 
    static async updateRating(req, res) {
        try {
            // Get property id form request parameters.
            const { propertyId } = req.params;

            // Get the rating data from request body.
            const {
                rating,
                comment
            } = req.body;

            // Check if rating exist or not
            if ((await prisma.rating.findFirst({ where: { id: propertyId } })).length === 0) {
                return res.status(404).json({
                    message: 'rating not found'
                });
            }

            // Update rating
            const updatedRating = await prisma.rating.update({
                where: {
                    id: propertyId
                },
                data: {
                    rating,
                    comment
                },
            });

            // return the updated rating
            res.status(200).json({
                data: updatedRating,
                message: 'Success'
            });

        } catch(error) {
            // Return Internal Server Error (500).
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}

// export default RatingController;
module.exports = {
    RatingController
};