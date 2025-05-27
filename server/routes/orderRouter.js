const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.getAll);
router.get('/:id', authMiddleware, orderController.getOne);
// router.post('/review', orderController.createReview);

module.exports = router;