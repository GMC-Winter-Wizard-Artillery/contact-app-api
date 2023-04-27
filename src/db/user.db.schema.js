const bcrypt = require("bcrypt");

module.exports = (mongoose) => {
  const UserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 48,
      },
    },
    {
      timestamps: true,
    }
  );

  UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    obj.id = obj._id;
    delete obj._id;
    delete obj.password;
    delete obj.__v;
    return obj;
  };

  UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };

  UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(12);

      this.password = await bcrypt.hash(this.password, salt);
    }
    return next();
  });

  UserSchema.statics.findByCredentials = async function (email, password) {
    // using Promise resolve/reject instead of throwing an error
    // because throwing hurts the performance while resolving/rejecting
    // is faster
    return new Promise(async (resolve, reject) => {
      const user = await this.findOne({
        email,
      });

      if (!user) {
        return reject(new Error("User not found"));
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return reject(new Error("Invalid password"));
      }

      return resolve(user);
    });
  };

  return mongoose.model("User", UserSchema);
};
