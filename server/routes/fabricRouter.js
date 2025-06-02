const Router = require('express')
const router = new Router()
const fabricController = require('../controllers/fabricController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), fabricController.create)
router.get('/', fabricController.getAll)
router.put('/:id', checkRole('ADMIN'), fabricController.update)
router.delete('/:id', checkRole('ADMIN'), fabricController.delete)

module.exports = router