const { Router } = require("express");
const validate = require("../middlewares/validate.midleware");
const { UserModel } = require("../db");
const {
  deserializeSession,
  requireSession,
} = require("../middlewares/session.middlewares");
const { UpdateUserSchema } = require("../schemas/user.schemas");

const router = Router();

router.get("/me", deserializeSession, requireSession, async (req, res) => {
  try {
    const user = await UserModel.findById(res.locals.session.user);

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

router.patch(
  "/me",
  validate(UpdateUserSchema),
  deserializeSession,
  requireSession,
  async (req, res) => {
    try {
      const user = await UserModel.findOne({ _id: res.locals.session.user });

      if (!user) {
        return res.status(404).json({
          status: "fail",
          message: "User not found",
        });
      }

      if (req.body.name) user.name = req.body.name;
      if (req.body.lastName) user.name = req.body.lastName;
      if (req.body.email) user.email = req.body.email;
      if (req.body.password) user.password = req.body.password;

      await user.save();

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  }
);

module.exports = router;
