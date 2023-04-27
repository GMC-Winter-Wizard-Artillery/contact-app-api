const { Router } = require("express");
const validate = require("../middlewares/validate.midleware");
const { UserModel, SessionModel } = require("../db");
const { SignupSchema, LoginSchema } = require("../schemas/auth.schema");
const {
  deserializeSession,
  requireSession,
} = require("../middlewares/session.middlewares");

const router = Router();

router.post("/register", validate(SignupSchema), async (req, res) => {
  try {
    const user = UserModel(req.body);
    await user.save();

    const session = await SessionModel.createSession(user._id);

    res.status(201).json({
      status: "success",
      data: {
        user,
        session,
      },
    });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({
        status: "fail",
        message: "Email already exists",
      });
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

router.post("/login", validate(LoginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;
    let error = null;
    const user = await UserModel.findByCredentials(email, password).catch(
      (err) => {
        error = err.message;
      }
    );

    if (!user && error) {
      return res.status(401).json({
        status: "fail",
        message: error,
      });
    }

    const session = await SessionModel.createSession(user._id);

    res.status(200).json({
      status: "success",
      data: {
        user,
        session,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

router.post("/logout", deserializeSession, requireSession, async (req, res) => {
  try {
    const session = res.locals.session;
    await session.deleteOne();

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

module.exports = router;
