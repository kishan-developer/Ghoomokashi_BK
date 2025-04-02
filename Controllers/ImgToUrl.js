const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const serviceModel = require("../Models/ServiceModel");
const multer = require('multer')
const path = require('path');
const fs = require('fs');
// const upload = multer({ dest: 'uploads/' })



// Ensure the uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb(new Error('Error: Only images are allowed! (jpeg, jpg, png, gif)'));
    }
};

const upload = multer({ storage, fileFilter }).single('image');

// Endpoint to upload image and return imgUrl
const uploadfile = asyncHandler(async(req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ status: 'error', message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No file uploaded' });
        }

        const imgUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.status(200).json({
            status: 'success',
            message: 'Image uploaded successfully',
            imgUrl
        });
    });
});

//create a new service page 
const getImgFiletoUrl = asyncHandler(async(req, res)=> {
    const { title, ImageUrl, content } = req.body;

    console.log("req.body", req.body);

    const serviceData = await serviceModel.create(req.body)

    res.status(200).json({
        status: "Success",
        message: "service is created!",
        data: serviceData
    })
})


module.exports = { uploadfile }