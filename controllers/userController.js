const { User, Image } = require("../models");
const bcrypt = require("bcrypt");
const Validator = require("fastest-validator");
const v = new Validator();

module.exports = {
  register: async (req, res) => {
    try {
      const schema = {
        f_name: "string|required",
        l_name: "string|required",
        nickname: "string|required",
        email: "email|required",
        password: "string|required",
      };

      const validate = v.validate(req.body, schema);
      if (validate.length) {
        return res.status(400).json({
          status: false,
          message: "bad request!",
          data: validate,
        });
      }

      const { email } = req.body;

      const isExist = await User.findOne({ where: { email: email } });

      if (isExist) {
        return res.status(400).json({
          status: false,
          message: "user already exist!",
          data: null,
        });
      }

      const { password } = req.body;

      const encryptedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        ...req.body,
        password: encryptedPassword,
        role: "user",
        login_type: "basic",
      });

      return res.status(201).json({
        status: true,
        message: "user created",
        data: newUser,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  },

  updateAvatar: async (req, res) => {
    try {
      const schema = {
        user_id: "number|required",
        image_id: "number|required",
      };

      const validate = v.validate(req.body, schema);
      if (validate.length) {
        return res.status(400).json({
          status: false,
          message: "bad request!",
          data: validate,
        });
      }

      const { user_id, image_id } = req.body;

      const image = await Image.findOne({ where: { id: image_id } });
      if (!image) {
        return res.status(400).json({
          status: false,
          message: "image is does'nt exist!",
          data: null,
        });
      }

      const user = await User.findOne({ where: { id: user_id } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "user is does'nt exist!",
          data: null,
        });
      }

      const updatedUser = await User.update(
        {
          avatar: image_id,
        },
        {
          where: { id: user_id },
        }
      );

      res.status(200).json({
        status: true,
        message: "avatar changed succesfully!",
        data: updatedUser,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  },

  showUser: async (req, res) => {
    try {
      const user_id = req.params.id;

      const user = await User.findOne({ where: { id: user_id } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "user is does'nt exist!",
          data: null,
        });
      }

      var avatar;
      const image = await Image.findOne({ where: { id: user.avatar } });
      if (image) {
        avatar = image;
      }

      res.status(200).json({
        status: true,
        message: "ok",
        data: {
          ...user.dataValues,
          avatar: avatar.url,
        },
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  },
};
