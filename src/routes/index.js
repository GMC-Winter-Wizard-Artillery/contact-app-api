const { Router } = require("express");
const authRoutes = require("./auth.route");
const userRoutes = require("./user.routes");
const contactRoutes = require("./contact.routes");
const {
  deserializeSession,
  requireSession,
} = require("../middlewares/session.middlewares");

module.exports = (app) => {
  const apiRoutes = Router();

  apiRoutes.use("/auth", authRoutes);
  apiRoutes.use("/user", userRoutes);
  apiRoutes.use("/contact", deserializeSession, requireSession, contactRoutes);

  app.use("/api", apiRoutes);
};
