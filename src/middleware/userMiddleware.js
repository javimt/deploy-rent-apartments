module.exports = {
  validateUserInput: (req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
      const {
        name,
        lastName,
        email,
        password
      } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          error: {
            code: 400,
            message: "Missing required fields",
          },
        });
      }

      const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,50}$/;
      if (!nameRegex.test(name)) {
        return res.status(400).json({
          error: {
            code: 400,
            message: "Invalid name format",
          },
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: {
            code: 400,
            message: "Invalid email format",
          },
        });
      }
      if (password.length < 4) {
        return res.status(400).json({
          error: {
            code: 400,
            message: "Password must be at least 4 characters long",
          },
        });
      }
    }
    next();
  },
};

