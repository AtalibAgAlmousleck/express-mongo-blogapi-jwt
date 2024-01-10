const { Router } = require("express");

const {
  register,
  login,
  getUser,
  changeAvatar,
  editUser,
  getUsers,
} = require("../controllers/user-controller");

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', getUser);
router.get('/', getUsers);
router.post('/change-avatar', changeAvatar);
router.patch('/edit-user', editUser);

module.exports = router;
