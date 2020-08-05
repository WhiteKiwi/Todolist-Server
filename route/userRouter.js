const router = require('express').Router();
const userController = require('./controller/userController');

// USER API
router.get('/', userController.getUser);
router.patch('/', userController.patchUser);
router.delete('/', userController.deleteUser);
router.patch('/change-password', userController.changePassword);

module.exports = router;
