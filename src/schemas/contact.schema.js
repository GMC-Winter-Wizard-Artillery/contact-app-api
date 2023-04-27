const z = require("zod");

const fields = ["firstName", "lastName", "email", "phone"];

const CreateContactSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: "Name is required",
    }),
    lastName: z.string({
      required_error: "Last name is required",
    }),
    email: z
      .string()
      .email({
        message: "Email is not valid",
      })
      .optional(),
    phone: z
      .string({
        required_error: "Phone is required",
      })
      .optional(),
    phone: z.string().optional(),
  }),
});

const UpdateContactSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: "Id is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, {
        message: "Id is not valid",
      }),
  }),
  body: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z
        .string()
        .email({
          message: "Email is not valid",
        })
        .optional(),
      phone: z
        .string({
          required_error: "Phone is required",
        })
        .optional(),
      phone: z.string().optional(),
    })
    .refine(
      (data) => {
        return Object.keys(data).some((key) => fields.includes(key));
      },
      {
        message: "At least one field is required",
      }
    ),
});

const DeleteContactSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: "Id is required",
      })
      .regex(/^[0-9a-fA-F]{24}$/, {
        message: "Id is not valid",
      }),
  }),
});

module.exports = {
  CreateContactSchema,
  UpdateContactSchema,
  DeleteContactSchema,
};
