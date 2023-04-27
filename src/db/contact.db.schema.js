module.exports = (mongoose) => {
  const contactSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    }
  );

  contactSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.id = obj._id;
    obj.initials = obj.firstName[0] + obj.lastName[0];
    delete obj._id;
    delete obj.__v;
    return obj;
  };

  return mongoose.model("Contact", contactSchema);
};
