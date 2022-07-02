const express = require("express");
const router = express.Router();
const storage = require("../middlewares/storage");
const { login, admin } = require("../middlewares");

const media = require("../controllers/mediaController");
const user = require("../controllers/userController");
const auth = require("../controllers/authController");
const history = require("../controllers/historyController");
const middleware = require("../middlewares");
const resetPassword = require("../controllers/resetPassword");

//web
const JWT = require("jsonwebtoken");
const { User } = require("../models");
const { JWT_SECRET_KEY } = process.env;

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/forgot-password", (req, res) => {
  res.render("forget-password");
});

router.get("/reset-password/:userId", async (req, res) => {
  try {
    const user_id = req.params.userId;
    const token = req.query.token;

    const user = await User.findOne({ where: { id: user_id } });

    const secret = JWT_SECRET_KEY + user.password;
    const data = JWT.verify(token, secret);

    res.render("reset-password", { token, user_id });
  } catch (err) {
    return res.status(500).json({
      status: false,
      status: err.message,
      data: null,
    });
  }
});


//upload media
router.post(
  "/upload/images",
  login,
  storage.uploadImage.single("images"),
  media.createImage
);
router.post(
  "/api/upload/videos",
  login,
  admin,
  storage.uploadVideos.single("videos"),
  media.createVideo
);
router.post(
  "/upload/files",
  login,
  admin,
  storage.uploadFiles.single("files"),
  media.createFile
);

//user controller
router.get("/user/:id", user.showUser);
router.put("/api/user/update-avatar", user.updateAvatar);

//history controller
router.get("/history/:id", history.getHistory);
router.post("/api/history", history.createHistory);
router.put("/api/history/:id", history.updateHistory);
router.delete("/api/history/:id", history.deleteHistory);

//auth
router.post("/api/auth/register", user.register);
router.post("/api/auth/login", auth.login);
router.get("/api/auth/who-am-i", middleware.login, auth.whoami);
router.get("/api/auth/google", auth.googleOAuth);
router.post("/api/auth/reset-password/:userId", resetPassword.reset);
router.post("/api/auth/forgot-password", user.forgotPassword);
router.put("/user/update-avatar", login, user.updateAvatar);

//history
router.post("/history", login, history.createHistory);
router.get("/history/:id", login, history.getHistory);
router.put("/history/:id", login, admin, history.updateHistory);
router.delete("/history/:id", login, admin, history.deleteHistory);

//auth
router.post("/auth/login", auth.login);
router.get("/auth/who-am-i", middleware.login, auth.whoami);
router.get("/auth/google", auth.googleOAuth);


module.exports = router;
