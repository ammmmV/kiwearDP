const Router = require('express')
const router = new Router()
const fabricController = require('../controllers/fabricController')

router.post('/', fabricController.create)
router.get('/', fabricController.getAll)

module.exports = router