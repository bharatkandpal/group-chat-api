const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.likeMessage = async (req, res) => {
  try {
    const message = await prisma.message.findFirst({
      where: { id: req.params.id },
    });
    if (!message) {
      return res.status(404).json({
        success: false,
        error: "message not found",
        timestamp: Date.now(),
      });
    }
    await prisma.userLike.create({
      data: { userId: req.user.id, messageId: req.params.id },
    });
    return res.status(201).json(message).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
