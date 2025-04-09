const express = require("express");
const router = express.Router();

// Import controller and middleware
const { uploadfile, uploadMiddleware } = require("../Controllers/ImgToUrl");
const validateToken = require("../Middlewares/validateToken");

// Route: Upload image to Cloudinary
router.post("/uploadimg", uploadMiddleware, uploadfile);

module.exports = router;
