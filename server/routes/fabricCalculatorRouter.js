const Router = require('express');
const router = new Router();
const fabricCalculatorController = require('../controllers/fabricCalculatorController');
const checkRole = require('../middleware/checkRoleMiddleware');

// Маршруты для администратора (создание, обновление, удаление)
router.post('/', checkRole('ADMIN'), fabricCalculatorController.create);
router.put('/:id', checkRole('ADMIN'), fabricCalculatorController.update);
router.delete('/:id', checkRole('ADMIN'), fabricCalculatorController.delete);

// Маршруты для всех пользователей (получение данных)
router.get('/', fabricCalculatorController.getAll);
router.get('/:id', fabricCalculatorController.getOne);
router.get('/type/:clothing_type', fabricCalculatorController.getByClothingType);

// Маршрут для расчета расхода ткани
router.post('/calculate', fabricCalculatorController.calculate);

module.exports = router;