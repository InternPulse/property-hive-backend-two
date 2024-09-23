import { Router } from 'express';
import RatingController from '../controllers/ratingController.js';

const ratingRoutes = Router();

// Authorization required.
ratingRoutes.get('/properties/:propertyId/rate', (req, res) => {
    RatingController.getRatings(req, res);
});

// Authorization required.
ratingRoutes.put('/properties/:propertyId/rate', (req, res) => {
    RatingController.updateRating(req, res);
});

export default ratingRoutes;