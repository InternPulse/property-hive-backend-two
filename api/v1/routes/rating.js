// import { Router } from 'express';
// import RatingController from '../controllers/rating';

const { Router } = require('express');
const { RatingController } = require('../controllers/rating');

const ratingRouter = Router();

// Authorization required.
ratingRouter.get('/properties/:propertyId/rate', (req, res) => {
    RatingController.getRatings(req, res);
});

// Authorization required.
ratingRouter.put('/properties/:propertyId/rate', (req, res) => {
    RatingController.updateRating(req, res);
});

module.exports = {
    ratingRouter,
};
// export default ratingRouter;