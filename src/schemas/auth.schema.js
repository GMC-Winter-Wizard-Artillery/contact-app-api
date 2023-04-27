const z = require("zod");

// used by login and signup
const PASSWORD_VALIDATION = z
  .string({
    required_error: "Password is required",
  })
  .min(8, "Password must be at least 8 characters")
  .max(48, "Password must be at most 48 characters");
// used by login and signup
const EMAIL_VALIDATION = z
  .string({
    required_error: "Email is required",
  })
  .email({
    message: "Email is not valid",
  });

const SignupSchema = z.object({
  body: z.object({
    email: EMAIL_VALIDATION,
    password: PASSWORD_VALIDATION,
    name: z.string({
      required_error: "Name is required",
    }),
    lastName: z.string({
      required_error: "Last name is required",
    }),
  }),
});

const LoginSchema = z.object({
  body: z.object({
    email: EMAIL_VALIDATION,
    password: PASSWORD_VALIDATION,
  }),
});

const SESSION_HEADER = "x-session-token";

const SessionHeaderSchema = z.object({
  headers: z.object({
    [SESSION_HEADER]: z.string({
      required_error: "Session token is required",
    }),
  }),
});

module.exports = {
  PASSWORD_VALIDATION,
  EMAIL_VALIDATION,
  SignupSchema,
  LoginSchema,
  SESSION_HEADER,
  SessionHeaderSchema,
};
