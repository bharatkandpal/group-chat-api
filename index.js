const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const groupRouter = require("./routes/group.routes");
const messageRouter = require("./routes/message.routes");
const prisma = new PrismaClient();
const routes = require("./routes");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", routes);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
