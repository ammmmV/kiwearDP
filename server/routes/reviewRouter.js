const Router = require('express');
const router = new Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, reviewController.create);
router.get('/', reviewController.getAll);
router.get('/user', authMiddleware, reviewController.getUserReviews);
router.delete('/:id', authMiddleware, reviewController.deleteReview);
router.put('/admin/status/:id', checkRoleMiddleware('ADMIN'), reviewController.updateReviewStatus);
router.get('/admin', authMiddleware, checkRoleMiddleware('ADMIN'), reviewController.getAllForAdmin);

module.exports = router;