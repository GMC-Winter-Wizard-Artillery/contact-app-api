const { Router } = require("express");
const { ContactModel } = require("../db");
const validate = require("../middlewares/validate.midleware");
const {
  CreateContactSchema,
  UpdateContactSchema,
  DeleteContactSchema,
} = require("../schemas/contact.schema");

const router = Router();

router.post("/", validate(CreateContactSchema), async (req, res) => {
  const contact = new ContactModel({
    ...req.body,
    user: res.locals.session.user._id,
  });

  await contact.save();

  res.status(201).json({
    status: "success",
    data: contact,
  });
});

router.patch("/:id", validate(UpdateContactSchema), async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await ContactModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!contact) {
      return res.status(404).json({
        status: "fail",
        message: "Contact not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

router.delete("/:id", validate(DeleteContactSchema), async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await ContactModel.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        status: "fail",
        message: "Contact not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  const contacts = await ContactModel.find({
    user: res.locals.session.user._id,
  });

  res.status(200).json({
    status: "success",
    data: contacts,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await ContactModel.findById(id);

    if (!contact) {
      return res.status(404).json({
        status: "fail",
        message: "Contact not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

module.exports = router;
