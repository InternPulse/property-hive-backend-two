import { Router } from 'express';
import RatingController from '../controllers/rating.js';

const ratingRouter = Router();

// Authorization required.
ratingRouter.get('/properties/:propertyId/rate', (req, res) => {
    RatingController.getRatings(req, res);
});

// Authorization required.
ratingRouter.put('/properties/:propertyId/rate', (req, res) => {
    RatingController.updateRating(req, res);
});

export default ratingRouter;