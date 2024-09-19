import { PrismaClient } from "@prisma/client";

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
            if (!(await prisma.rating.findFirst({ where: { propertyId } }))) {
                return res.status(404).json({
                    message: 'rating not found'
                });
            }

            // Get all ratings for specific property.
            const ratings = await prisma.rating.findMany({
                where: {
                    propertyId,
                }
            });

            // Return list of ratings.
            return res.status(200).json({
                data: ratings,
                message: "Rating found successfully"
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
     * Error Response:
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

            // Check for input validation (rating, comment)
            if (typeof rating !== 'number' || typeof comment !== 'string') {
                return res.status(400).json({
                    message: "The provided fileds are not valid"
                });
            }

            // Check if rating between 1 - 5
            if (!(rating <= 5 && rating >= 1)) {
                return res.status(400).json({
                    message: 'rating value should be between 1 and 5',
                });
            }

            // Check if property rating exist or not
            if (!(await prisma.rating.findFirst({ where: { propertyId } }))) {
                return res.status(404).json({
                    message: 'Rating not found'
                });
            }

            // Get rating Id
            const ratingId = await prisma.rating.findFirst({
                where: {
                    propertyId
                }
            });

            // Update property rating
            const updatedRating = await prisma.rating.update({
                where: {
                    id: ratingId.id
                },
                data: {
                    rating,
                    comment
                },
            });

            // return the updated rating
            res.status(200).json({
                data: updatedRating,
                message: 'Rating updated successfully'
            });

        } catch(error) {
            console.log(error.message)
            // Return Internal Server Error (500).
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}

export default RatingController;