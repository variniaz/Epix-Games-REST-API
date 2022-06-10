const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const ejs = require("ejs");

const {
  OAUTH_REFRESH_TOKEN,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  SERVER_ROOT_URI,
  EMAIL_SENDER,
} = process.env;

const oauth2Client = new google.auth.OAuth2(
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  SERVER_ROOT_URI
);

oauth2Client.setCredentials({ refresh_token: OAUTH_REFRESH_TOKEN });

module.exports = {
  sendEmail: async (to, subject, html) => {
    try {
      const accessToken = await oauth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: EMAIL_SENDER,
          clientId: OAUTH_CLIENT_ID,
          clientSecret: OAUTH_CLIENT_SECRET,
          refreshToken: OAUTH_REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        to,
        subject,
        html,
      };

      const response = await transport.sendMail(mailOptions);
      return response;
    } catch (err) {
      return err;
    }
  },

  getHtml: (fileName, data) => {
    return new Promise((resolve, reject) => {
      const path = __dirname + "/../views/" + fileName;
      ejs.renderFile(path, data, (err, data) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(data);
        }
      });
    });
  },
};
