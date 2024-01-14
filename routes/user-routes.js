const { Router } = require("express");
const authentication = require('../middlewares/authentication');

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
router.post('/change-avatar', authentication, changeAvatar);
router.patch('/edit-user', authentication, editUser);

module.exports = router;
