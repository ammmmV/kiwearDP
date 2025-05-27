const Router = require('express')
const router = new Router()
const patternController = require('../controllers/patternController')

router.post('/', patternController.create)
router.get('/', patternController.getAll)
router.get('/', patternController.getOne)

router.delete('/:id', patternController.deletePattern)
router.put('/:id', patternController.updatePattern)


router.get('/patt', patternController.getPatterns)

module.exports = router