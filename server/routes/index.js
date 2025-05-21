const Router = require('express')
const router = new Router()
const patternRouter = require('./patternRouter')
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const fabricRouter = require('./fabricRouter')
const basketRouter = require('./basketRouter')

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/pattern', patternRouter)
router.use('/fabric', fabricRouter)
router.use('/basket', basketRouter)

module.exports = router