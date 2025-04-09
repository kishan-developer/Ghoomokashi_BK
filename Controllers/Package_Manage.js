const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Package_Model = require("../Models/Package_Model");
const NodeCache = require("node-cache");


const nodecache = new NodeCache()

//create a new service page 
const createPackage = asyncHandler(async (req, res) => {
    const { title, ImageUrl, content, days, destination } = req.body;

    // console.log("req.body", req.body);

    const PackageData = await Package_Model.create(req.body)

    nodecache.del("packages");


    res.status(200).json({
        status: "Success",
        message: "PackageData is created!",
        data: PackageData
    })
})


// get all packages 
const getAllPackages = asyncHandler(async (req, res) => {

    let packages;

    if (nodecache.has("packages")) {
        packages = JSON.parse(nodecache.get("packages"));
    } else {
        packages = await Package_Model.find();
        nodecache.set("packages", JSON.stringify(packages));
    }

    if (!packages) {
        res.status(400);
        throw new Error("Packages Not Found!")
    }

    res.status("200").json({
        status: "Success",
        message: "Package data get Successfully!",
        packagesLength: packages.length,
        data: packages
    })
})


const getOnePackage = asyncHandler(async (req, res) => {
    const { _id } = req.params;

    const package = await Package_Model.findById({ _id: _id });

    nodecache.del("packages");


    if (!package) {
        res.status(400);
        throw new Error("Package Not Found!");
    }

    res.status(200).json({
        status: "success",
        message: "Successfully get Packages Data",
        data: package
    })
})


const updatePackage = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    const { title, ImageUrl, content, days, destination } = req.body;

    const updateData = await Package_Model.findByIdAndUpdate(
        { _id: _id },
        { $set: { title: title, ImageUrl: ImageUrl, content: content, days: days, destination: destination } },
        { returnDocument: "after", upsert: true }
    )

    nodecache.del("packages");

    res.status(200).json({
        message: "Successfully Update Current User data",
        data: updateData
    })
})


// update and Delete 
const deletePackage = asyncHandler(async (req, res) => {
    const { _id } = req.params;

    if (!_id) {
        res.status(401);
        throw new Error("package Details not valid!")
    }

    // check service for new user 
    const checkPackage = await Package_Model.findById({ _id: _id });

    if (!checkPackage) {
        res.status(401);
        throw new Error("Package Not Available")
    }

    const package = await Package_Model.deleteOne({ _id: _id });

    nodecache.del("packages");

    res.status(200).json({
        status: "Success",
        message: "Package Data Delete Successfully!",
    })
})


module.exports = { createPackage, getAllPackages, getOnePackage, updatePackage, deletePackage };