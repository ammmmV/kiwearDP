const Router = require('express');
const router = new Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, reviewController.create);
router.get('/', authMiddleware, reviewController.getAll);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;