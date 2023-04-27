const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.safeParse(req);
    if (error) {
      return res.status(400).json({
        status: "fail",
        message: error.issues?.[0]?.message ?? "Invalid request",
        issues: error.issues,
      });
    }
    next();
  };
};

module.exports = validate;
