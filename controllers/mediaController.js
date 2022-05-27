const { Image, Video, Files } = require("../models");

module.exports = {
  createImage: async (req, res) => {
    try {
      const imageUrl =
        req.protocol + "://" + req.get("host") + "/image/" + req.file.filename;

      const image = await Image.create({
        title: req.file.filename,
        url: imageUrl,
      });

      res.status(200).json({
        status: true,
        message: "success",
        data: image,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
      // console.log(err)
    }
  },

  createVideo: async (req, res) => {
    try {
      const videoUrl =
        req.protocol + "://" + req.get("host") + "/videos/" + req.file.filename;

      const videos = await Video.create({
        title: req.file.filename,
        url: videoUrl,
      });

      res.status(200).json({
        status: true,
        message: "success",
        data: videos,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
  },

  createFile: async (req, res) => {
    try {
      const fileUrl =
        req.protocol + "://" + req.get("host") + "/files/" + req.file.filename;

      const files = await Files.create({
        title: req.file.filename,
        url: fileUrl,
      });

      res.status(200).json({
        status: true,
        message: "success",
        data: files,
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
