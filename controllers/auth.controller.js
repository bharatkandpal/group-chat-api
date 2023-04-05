const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};
module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findFirst({ where: { username: username } });
    if (!user) {
      return res.status(404).json("user not found").send();
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json("invalid credentials").send();
    }
    const token = generateToken({
      userId: user.id,
      isAdmin: user.isAdmin || false,
    });
    return res
      .status(200)
      .json({ success: true, data: token, timestamp: Date.now() })
      .send();
  } catch (e) {
    console.error(e);
    res.status(400).json({ e }).send();
  }
};
// this is for one time use only, To create the First ADMIN user
module.exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findFirst({ where: { username: username } });
    if (user) {
      return res.status(400).json("username already taken").send();
    }
    const encryptedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { isAdmin: true, username: username, password: encryptedPassword },
    });
    return res.status(200).json("Registered as admin").send();
  } catch (e) {
    console.error(e);
    res.status(400).json({ e }).send();
  }
};
