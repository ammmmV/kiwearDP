const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, basketController.addToBasket);
router.get('/', authMiddleware, basketController.getBasket);
router.delete('/:patternId', authMiddleware, basketController.removeFromBasket);
router.put('/:id', authMiddleware, basketController.updateQuantity);

module.exports = router;