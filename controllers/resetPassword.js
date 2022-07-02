const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWT_SECRET_KEY } = process.env;

module.exports = {
  reset: async (req, res) => {
    try {
      const token = req.query.token;
      const user_id = req.params.userId;
      const { new_password, confirm_new_password } = req.body;

      if (new_password != confirm_new_password) {
        return res.status(400).json({
          status: false,
          message: "your password confirmation doesn't match",
          data: null,
        });
      }

      const user = await User.findOne({ where: { id: user_id } });

      const secret = JWT_SECRET_KEY + user.password;
      const data = await jwt.verify(token, secret);

      const encryptedPassword = await bcrypt.hash(new_password, 10);

      let query = {
        where: {
          email: data.email,
        },
      };

      let updated = await User.update(
        {
          password: encryptedPassword,
        },
        query
      );

      return res.json({
        status: true,
        message: "password changed.",
        data: updated,
      });
    } catch (err) {
      return res.status(500).json({
        status: true,
        message: err.message,
        data: null,
      });
    }
  },
};
