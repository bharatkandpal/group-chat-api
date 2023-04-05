const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { authenticateAdmin } = require("../middleware/auth");
router.post("/", authenticateAdmin, userController.createUser);
router.get("/", authenticateAdmin, userController.listUsers);
router.put("/:id", authenticateAdmin, userController.updateUser);

module.exports = router;
