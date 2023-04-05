const router = require("express").Router();
const groupController = require("../controllers/group.controller");
const { authenticate } = require("../middleware/auth");
router.post("/", authenticate, groupController.createGroup);
router.get("/", authenticate, groupController.searchGroups);
router.post("/:id/members", authenticate, groupController.addMemberToGroup);
router.get("/:id/messages", authenticate, groupController.getMessages);
router.post("/:id/messages", authenticate, groupController.sendMessage);
router.delete("/:id", authenticate, groupController.deleteGroup);

router.delete(
  "/:id/members/:userId",
  authenticate,
  groupController.removeGroupMember
);
module.exports = router;
