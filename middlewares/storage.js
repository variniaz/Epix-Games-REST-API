const multer = require("multer");
const path = require("path");

const storageImage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/images");
  },

  filename: function (req, file, callback) {
    const namaFile = Date.now() + "-" + path.extname(file.originalname);
    callback(null, namaFile);
  },
});

const storageFiles = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/files");
  },

  filename: function (req, file, callback) {
    const namaFile = Date.now() + "-" + path.extname(file.originalname);
    callback(null, namaFile);
  },
});

const storageVideos = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/videos");
  },

  filename: function (req, file, callback) {
    const namaFile = Date.now() + "-" + path.extname(file.originalname);
    callback(null, namaFile);
  },
});

const uploadImage = multer({
  storage: storageImage,
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
      callback(new Error("only png, jpg, and jped allowed to upload!"));
    }
  },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

const uploadFiles = multer({
  storage: storageFiles,
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype == "application/pdf" ||
      file.mimetype == "application/msword" ||
      file.mimetype == "application/xls"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
      callback(new Error("only pdf, docs, and xls allowed to upload!"));
    }
  },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

const uploadVideos = multer({
  storage: storageVideos,
  fileFilter: (req, file, callback) => {
    if (file.mimetype == "video/mp4") {
      callback(null, true);
    } else {
      callback(null, false);
      callback(new Error("only mp4 allowed to upload!"));
    }
  },
  onError: function (err, next) {
    console.log("error", err);
    next(err);
  },
});

module.exports = {
  uploadImage,
  uploadFiles,
  uploadVideos,
};
