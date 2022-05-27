const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { google } = require("googleapis");
const Validator = require("fastest-validator");
const v = new Validator();

const {
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  SERVER_ROOT_URI,
  JWT_SECRET_KEY,
  SERVER_LOGIN_ENDPOINT,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  `${SERVER_ROOT_URI}/${SERVER_LOGIN_ENDPOINT}`
);

function generateAuthUrl() {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    response_type: "code",
    scope: scopes,
  });

  return url;
}

async function setCredentials(code) {
  return new Promise(async (resolve, rejects) => {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      return resolve(tokens);
    } catch (err) {
      return rejects(err);
    }
  });
}

function getUserInfo() {
  return new Promise(async (resolve, rejects) => {
    try {
      var oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      const data = oauth2.userinfo.get((err, res) => {
        if (err) {
          return rejects(err);
        } else {
          return resolve(res);
        }
      });
    } catch (err) {
      return rejects(err);
    }
  });
}

module.exports = {
  login: async (req, res) => {
    try {
      const schema = {
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

      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "user not found",
          data: null,
        });
      }

      const passwordCorrect = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordCorrect) {
        return res.status(400).json({
          status: false,
          message: "wrong password",
          data: null,
        });
      }

      const data = {
        login_type: "basic",
        id: user.id,
        f_name: user.f_name,
        l_name: user.l_name,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
      };

      const secretKey = process.env.JWT_SECRET_KEY;
      const token = jwt.sign(data, secretKey);

      res.status(200).json({
        status: true,
        message: "ok",
        data: {
          ...data,
          token,
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

  whoami: async (req, res) => {
    const currentUser = req.user;

    res.status(200).json({
      status: true,
      message: "ok",
      data: currentUser,
    });
  },

  googleOAuth: async (req, res) => {
    try {
      const code = req.query.code;

      if (!code) {
        // generate url login
        const loginUrl = generateAuthUrl();

        // redirect to oauth login page
        return res.redirect(loginUrl);
      }

      // get token and set credentials
      await setCredentials(code);

      const { data } = await getUserInfo();
      const emailGoogle = data.email;
      const { email } = req.body;
      let user = await User.findOne({ where: { email: emailGoogle } });

      if (!user) {
        user = await User.create({
          login_type: "google-oauth2",
          id: data.id,
          name: data.name,
          email: data.email,
        });
      }

      const token = jwt.sign(user.toJSON(), JWT_SECRET_KEY);

      res.status(200).json({
        status: true,
        message: "login success!",
        data: {
          ...user,
          token,
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
