"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    checkPassword = (password) => {
      return bcrypt.compareSync(password, this.password);
    };

    generateToken = () => {
      const payload = {
        id: this.id,
        name: this.name,
        email: this.email,
      };

      const secretKey = process.env.JWT_SECRET_KEY;

      const token = jwt.sign(payload, secretKey);
      return token;
    };

    static authenticate = async ({ email, password }) => {
      try {
        const user = await this.findOne({
          where: {
            email: email,
          },
        });
        if (!user) return Promise.reject(new Error("user not found!"));

        const isPasswordValid = user.checkPassword(password);
        if (!isPasswordValid)
          return Promise.reject(new Error("wrong password!"));

        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    };
  }
  User.init(
    {
      login_type: DataTypes.STRING,
      f_name: DataTypes.STRING,
      l_name: DataTypes.STRING,
      nickname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.INTEGER,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
