const z = require("zod");
const { PASSWORD_VALIDATION, EMAIL_VALIDATION } = require("./auth.schema");

const fields = ["email", "password", "name", "lastName"];

const UpdateUserSchema = z.object({
  body: z
    .object({
      email: EMAIL_VALIDATION.optional(),
      password: PASSWORD_VALIDATION.optional(),
      name: z
        .string({
          required_error: "Name is required",
        })
        .optional(),
      lastName: z
        .string({
          required_error: "Last name is required",
        })
        .optional(),
    })
    .refine(
      (data) => {
        return Object.keys(data).some((key) => fields.includes(key));
      },
      {
        message: "At least one field is required",
        path: ["body"],
      }
    ),
});

module.exports = {
  UpdateUserSchema,
};
