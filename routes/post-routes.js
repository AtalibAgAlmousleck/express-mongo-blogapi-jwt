const { Router } = require("express");
const postController = require('../controllers/post-controller');

const router = Router();

router.post("/", postController.createPost);

module.exports = router;
