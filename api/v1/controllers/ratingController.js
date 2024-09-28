import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class RatingController {
    /**
     * Retrieve ratings for specific property.
     * @param {Request} req - Request Object
     * @param {Response} res - Request Object
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
            if (!(await prisma.common_ratings.findFirst({ where: { propertyid_id: Number(propertyId) } }))) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Ratings not found'
                });
            }

            // Get all ratings for specific property.
            const ratings = await prisma.common_ratings.findMany({
                where: {
                    propertyid_id: Number(propertyId),
                }
            });

            for (let rating of ratings) {
                rating.id = Number(rating.id);
                rating.userid_id = Number(rating.userid_id);
                rating.propertyid_id = Number(rating.propertyid_id);
    
            }

            // Return list of ratings.
            return res.status(200).json({
                statusCode: 200,
                data: ratings,
                message: "Ratings found successfully"
            });
        } catch(error) {
            // Return Internal Server Error (500).
            return res.status(500).json({
                statusCode: 500,
                message: "An error occurred",
                error: error.message
            });
        }
    }

    /**
     * Update rating data for specific property.
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
            const { propertyId, rateId } = req.params;

            // Get the rating data from request body.
            const {
                rate,
                comment
            } = req.body;

            // Check for input validation (rating, comment)
            if (typeof rate !== 'number' || typeof comment !== 'string') {
                return res.status(400).json({
                    statusCode: 400,
                    message: "The provided fileds are not valid"
                });
            }

            // Check if rating between 1 - 5
            if (!(rate <= 5 && rate >= 1)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Rating value should be between 1 and 5',
                });
            }

            // Check if property rating exist or not
            if (!(await prisma.common_ratings.findFirst({ where: { propertyid_id: Number(propertyId) } }))) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Rating not found'
                });
            }

            // Get rating Id
            const ratingId = await prisma.common_ratings.findFirst({
                where: {
                    propertyid_id: Number(propertyId)
                }
            });

            // Update property rating
            const updatedRating = await prisma.common_ratings.update({
                where: {
                    id: Number(rateId)
                },
                data: {
                    rate,
                    comment
                },
            });

            updatedRating.id = Number(updatedRating.id);
            updatedRating.propertyid_id = Number(updatedRating.propertyid_id);
            updatedRating.userid_id = Number(updatedRating.userid_id);
            // return the updated rating
            res.status(200).json({
                data: updatedRating,
                message: 'Rating updated successfully'
            });

        } catch(error) {
            console.log(error.message)
            // Return Internal Server Error (500).
            return res.status(500).json({
                statusCode: 500,
                message: "An error occurred",
                error: error.message
            });
        }
    }

    /**
     * Add rating to specific property 
     * @param {Request} req - Request Object
     * @param {Response} res - Response Object
     * @return: - Return the new rating data
     */
    static async addRating(req, res) {
        const { propertyId } = req.params;

        const {
            comment,
            rate,
            userId
        } = req.body;

        try {
            // Check if the property exist at or not
            if (!(await prisma.common_property.findFirst({ where: { id: Number(propertyId) } }))) {
                return res.status(404).json({
                    statusCode: 404,
                    message: 'Property not found'
                });
            }

            // Check for input validation (rating, comment)
            if (
                typeof rate !== 'number' ||
                typeof comment !== 'string' ||
                comment.length <= 0
            ) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "The provided fileds are not valid"
                });
            }

            // Check if rating between 1 - 5
            if (!(rate <= 5 && rate >= 1)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Rating value should be between 1 and 5',
                });
            }

            const propertyRating = await prisma.common_ratings.create({
                data: {
                    rate,
                    comment,
<<<<<<< HEAD
                    propertyid_id: Number(propertyId),
                    userid_id: Number(userId)
=======
                    propertyId: Number(propertyId),
                    userId: Number(userId)
>>>>>>> 51cac09ee2a10cb44d69f3244da61cb02919c7ce
                }
            });

            propertyRating.id = Number(propertyRating.id);
            propertyRating.userid_id = Number(propertyRating.userid_id);
            propertyRating.propertyid_id = Number(propertyRating.propertyid_id);
            
            console.log(propertyRating)

            return res.status(201).json({
                statusCode: 201,
                message: 'Rating created Successfully',
                data: propertyRating
            });

        } catch(error) {
            return res.status(500).json({
                statusCode: 500,
                message: 'An error occurred',
                error: error.message
            });
        }
    }
}

export default RatingController;