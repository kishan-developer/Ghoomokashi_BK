const asyncHandler = require("express-async-handler");
const multer = require("multer");
const { storage } = require("../Utils/cloudinary"); // use the custom cloudinary config
const NodeCache = require("node-cache");


const nodecache = new NodeCache()
const upload = multer({ storage });

const uploadfile = asyncHandler(async (req, res) => {
    // At this point, multer will automatically upload the image to Cloudinary

    // console.log("req.file", req.file)
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    

    res.status(200).json({
        imageUrl: req.file.path,       // Cloudinary image URL
        publicId: req.file.filename,   // Public ID for later use (delete/update)
        message: "Image uploaded successfully"
    });
});

// Middleware to use in your route
const uploadMiddleware = upload.single("image");

module.exports = { uploadfile, uploadMiddleware };
