// controllers/groupController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const addUserToGroup = async (groupId, userId) => {
  await prisma.groupUser.create({ data: { groupId: groupId, userId: userId } });
};
exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const group = await prisma.group.create({ data: { name: name } });
    await prisma.groupUser.create({
      data: { userId: req.user.id, groupId: group.id },
    });
    return res
      .status(201)
      .json({ success: true, data: group, timestamp: Date.now() }).send;
  } catch (error) {
    return res.status(400).json({ message: error.message }).send();
  }
};

exports.searchGroups = async (req, res) => {
  try {
    const condition = req.query.name
      ? { name: { contains: req.query.name } }
      : true;
    const groups = await prisma.group.findMany({
      where: condition,
      include: {
        groupUsers: { include: { user } },
      },
    });
    if (!groups) {
      return res.status(404).json({}).send();
    }
    return res
      .status(200)
      .json({ success: true, data: groups, timestamp: Date.now() })
      .send();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.addMemberToGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const group = await prisma.group.findFirst({
      where: { id: id },
    });
    if (!group) {
      return res.status(404).json({
        success: false,
        error: "group not found",
        timestamp: Date.now(),
      });
    }
    const user = await prisma.user.findFirst({ where: { id: id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "user not found",
        timestamp: Date.now(),
      });
    }
    await addUserToGroup(id, userId);
    return res
      .status(200)
      .json({ success: true, data: null, timestamp: Date.now() })
      .send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await prisma.group.findFirst({
      where: { id: id },
      include: { messages: true },
    });
    if (!group) {
      return res.status(404).json({
        success: false,
        error: "group not found",
        timestamp: Date.now(),
      });
    }

    return res
      .status(200)
      .json({ success: true, data: group.messages, timestamp: Date.now() })
      .send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const group = await prisma.group.findFirst({
      where: { id: id },
    });
    if (!group) {
      return res.status(404).json({
        success: false,
        error: "group not found",
        timestamp: Date.now(),
      });
    }
    const message = await prisma.message.create({
      data: { content: content, groupId: id },
    });
    return res
      .status(200)
      .json({ success: true, data: message, timestamp: Date.now() })
      .send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await prisma.group.findFirst({ where: { id: id } });
    if (!group) {
      return res.status(404).json({
        success: false,
        error: "group not found",
        timestamp: Date.now(),
      });
    }
    await prisma.groupUser.deleteMany({ where: { groupId: id } }); // remove all members from group
    await prisma.group.delete({ where: { id: id } }); // delete group
    return res
      .status(200)
      .json({ message: "Group deleted successfully" })
      .send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.removeGroupMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const groupUser = await prisma.groupUser.findFirst({
      where: { groupId: id, userId: userId },
    });
    if (!group) {
      return res.status(404).json({
        success: false,
        error: "user not found in the group",
        timestamp: Date.now(),
      });
    }
    await prisma.groupUser.delete({ where: { id: groupUser.id } });
    return res
      .status(200)
      .json({ message: "Group member removed successfully" })
      .send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
