const express = require("express");
const router = express.Router();
const storage = require("../middlewares/storage");
const { login, admin } = require("../middlewares");

const media = require("../controllers/mediaController");
const user = require("../controllers/userController");
const auth = require("../controllers/authController");
const history = require("../controllers/historyController");
const middleware = require("../middlewares");

//upload media
router.post(
  "/upload/images",
  login,
  storage.uploadImage.single("images"),
  media.createImage
);
router.post(
  "/upload/videos",
  login,
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
router.post("/user/register", user.register);
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
