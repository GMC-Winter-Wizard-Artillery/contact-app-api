const mongoose = require("mongoose");
const UserSchema = require("./user.db.schema");
const SessionSchema = require("./session.db.schema");
const ContactSchema = require("./contact.db.schema");

module.exports = {
  connect: async () => {
    const mong = await mongoose.connect(
      "mongodb://127.0.0.1:27017/contact-api"
    );

    const db = mong.connection;

    db.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });

    db.once("open", () => {
      console.log("MongoDB connected successfully!");
    });

    return db;
  },
  UserModel: UserSchema(mongoose),
  SessionModel: SessionSchema(mongoose),
  ContactModel: ContactSchema(mongoose),
};
