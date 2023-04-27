const validate = require("./validate.midleware");
const {
  SessionHeaderSchema,
  SESSION_HEADER,
} = require("../schemas/auth.schema");
const { SessionModel } = require("../db");

const deserializeSession = async (req, res, next) => {
  return validate(SessionHeaderSchema)(req, res, async () => {
    const sessionToken = req.headers[SESSION_HEADER];

    const session = await SessionModel.findByToken(sessionToken);

    if (!session || session.isExpired()) {
      return res.status(401).json({
        status: "fail",
        message: !session ? "Invalid Session Token" : "Session expired",
      });
    }

    res.locals.session = session;

    next();
  });
};

const requireSession = (req, res, next) => {
  if (!res.locals.session) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized",
    });
  }
  next();
};

module.exports = {
  deserializeSession,
  requireSession,
};
