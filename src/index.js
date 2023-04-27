const express = require("express");
const cors = require("cors");
const db = require("./db");
const routes = require("./routes");

async function main() {
  await db.connect();

  const app = express();

  app.use(cors());

  app.use(express.json());

  app.get("/health", (req, res) => {
    res.send("ok");
  });

  routes(app);
  app.listen(1300, () => {
    console.log("Server is running on port 1300");
  });
}

main();
