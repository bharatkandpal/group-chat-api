const router = require("express").Router();
const messageController = require("../controllers/message.controller");
const { authenticate } = require("../middleware/auth");

router.put(
  "/api/message/:id/like",
  authenticate,
  messageController.likeMessage
);

module.exports = router;
