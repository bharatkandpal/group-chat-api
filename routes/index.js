const routes = require("express").Router();
const auth = require("./auth.routes");
const user = require("./user.routes");
const group = require("./group.routes");
const message = require("./message.routes");
routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/groups", group);
routes.use("/messages", message);

routes.get("/", (req, res) => {
  res.status(200).json({ message: "Connected!" });
});

module.exports = routes;
