const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

module.exports.createUser = async (req, res) => {
  const { username, password, isAdmin } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: passwordHash,
        isAdmin: isAdmin ?? false,
      },
    });
    return res.status(201).json({ user }).send();
  } catch (e) {
    console.error(e);
    res.status(400).json({ e }).send();
  }
};
module.exports.updateUser = async (req, res) => {
  const { id } = req.params.id;
  const { username, isAdmin } = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { id: id } });
    let data;
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          error: "user not found",
          timestamp: Date.now(),
        })
        .send();
    }
    if (isAdmin == null && username == null) {
      return res
        .status(400)
        .json({ success: false, error: "invalid input", timestamp: Date.now() })
        .send();
    }
    if (username == null) {
      data = { isAdmin: isAdmin };
    }

    const userWithUsername = await prisma.user.findFirst({
      where: { username: username },
    });
    if (!!userWithUsername) {
      return res
        .status(400)
        .json({
          success: false,
          error: "duplicate/invalid username",
          timestamp: Date.now(),
        })
        .send();
    }
    data =
      isAdmin == null
        ? { username: username }
        : { username: username, isAdmin: isAdmin };

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: data,
    });
    return res.status(201).json({ updatedUser }).send();
  } catch (e) {
    console.error(e);
    res.status(400).json({ e }).send();
  }
};
module.exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          error: "user not found",
          timestamp: Date.now(),
        })
        .send();
    }
    return res
      .status(200)
      .json({ success: true, data: users, timestamp: Date.now() })
      .send();
  } catch (e) {
    console.error(e);
    res.status(400).json({ e }).send();
  }
};
