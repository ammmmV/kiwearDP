const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, orderController.create);
router.get('/', authMiddleware, orderController.getAll);
router.get('/:id', authMiddleware, orderController.getOne);
router.get('/admin/all', checkRoleMiddleware('ADMIN'), orderController.getAllOrders);
router.put('/admin/status/:id', checkRoleMiddleware('ADMIN'), orderController.updateStatus);
router.delete('/admin/:id', checkRoleMiddleware('ADMIN'), orderController.deleteOrder);

module.exports = router;