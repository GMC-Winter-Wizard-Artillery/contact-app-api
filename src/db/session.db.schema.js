const crypto = require("crypto");

const HOUR_IN_MS = 1000 * 60 * 60;

const SESSION_EXPIRATION = HOUR_IN_MS * 24 * 7; // 7 days

module.exports = (mongoose) => {
  const SessionSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      token: {
        type: String,
        required: true,
        unique: true,
      },
      expiresAt: {
        type: Date,
        required: true,
        default: Date.now() + SESSION_EXPIRATION,
      },
    },
    {
      timestamps: true,
    }
  );

  SessionSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;
    return obj;
  };

  SessionSchema.methods.isExpired = function () {
    return Date.now() > this.expiresAt;
  };

  // Static methods

  /**
   *  Create a new session for a user
   *  Generate a random token and save it to the database
   * @param {import("mongoose").ObjectId} userId  User ID to create a session for
   * @returns  The created session
   */
  SessionSchema.statics.createSession = async function (userId) {
    const token = crypto.randomBytes(64).toString("base64url");
    const session = await this.create({
      user: userId,
      token,
    });
    return session;
  };

  /**
   * Find a session by token
   * @param {string} token
   * @returns  The session or null if not found
   */
  SessionSchema.statics.findByToken = async function (token) {
    const session = await this.findOne({
      token,
    }).populate("user");
    return session;
  };

  return mongoose.model("Session", SessionSchema);
};
