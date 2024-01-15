const { Router } = require("express");
const authentication = require('../middlewares/authentication');

const userController = require("../controllers/user-controller");

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/:id', userController.getUser);
router.get('/', userController.getUsers);
router.post('/change-avatar',authentication, userController.changeAvatar);
router.patch('/edit-user',authentication, userController.editUser);
router.delete('/:userId',authentication, userController.deleteUser)

module.exports = router;
