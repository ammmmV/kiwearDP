const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/registration', userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)
router.get('/', userController.getUsers)
router.get('/profileData', userController.getCurrentUser);
router.delete('/:id', userController.deleteUser)
router.put('/:id/role', userController.updateRole)
router.put('/update', authMiddleware, userController.updateUser);

module.exports = router