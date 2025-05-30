const Router = require('express');
const router = new Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, reviewController.create);
router.get('/', reviewController.getAll);
router.get('/user', authMiddleware, reviewController.getUserReviews);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;