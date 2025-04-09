
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const serviceModel = require("../Models/ServiceModel");
const NodeCache = require("node-cache");


const nodecache = new NodeCache()

//create a new service page 
const createService = asyncHandler(async (req, res) => {
    const { title, ImageUrl, content } = req.body;

    // console.log("req.body", req.body);

    const serviceData = await serviceModel.create(req.body)
    nodecache.del("allservice");

    res.status(200).json({
        status: "Success",
        message: "service is created!",
        data: serviceData
    })
})


//URl ->  {{Base_Url}}/api/student/course/enrolled/all 
// get all enrolled couses list 
// get login user data list 
const getAllService = asyncHandler(async (req, res) => {

    let allservice;

    if (nodecache.has("allservice")) {
        allservice = JSON.parse(nodecache.get("allservice"));
    } else {
        allservice = await serviceModel.find();
        nodecache.set("allservice", JSON.stringify(allservice));
    }


    if (!allservice) {
        res.status(400);
        throw new Error("services Data Not Found!")
    }

    res.status(200).json({
        status: "success",
        message: "Get all Services list...",
        dataLength: allservice.length,
        data: allservice
    })
})


// get one user data 
const getoneservice = asyncHandler(async (req, res) => {

    const { _id } = req.params;


    const serviceData = await serviceModel.findById({ _id });
    nodecache.del("allservice");
    if (!serviceData) {
        res.status(400);
        throw new Error("Service Data not Found! Pleach Check your Id ")
    }

    res.status(200).json({
        status: "sucess",
        message: "Get One Service Data Successfully!",
        data: serviceData,
    })
})

// update one user details
const updateservice = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    // console.log("req.body", req.body);
    const { title, ImageUrl, content } = req.body;

    if (!_id) {
        res.status(400);
        throw new Error("_id Not Found, Something went Wrong!")
    }

    const updateddata = await serviceModel.findByIdAndUpdate(
        { _id: _id },
        { $set: { title: title, ImageUrl: ImageUrl, content: content } },
        { returnDocument: "after", upsert: true }
    )

    nodecache.del("allservice");

    if (!updateddata) {
        res.status(400)
        throw new Error("Service data not found!")
    }

    res.status(200).json({
        message: "Successfully Update Current Service data",
        data: updateddata
    })
})

// update and Delete 
const deleteservice = asyncHandler(async (req, res) => {
    const { _id } = req.params;

    if (!_id) {
        res.status(401);
        throw new Error("Service Details not valid!")
    }

    // check service for new user 
    const checkservice = await serviceModel.findById({ _id: _id });

    nodecache.del("allservice");

    if (!checkservice) {
        res.status(401);
        throw new Error("Service Not Available")
    }

    const service = await serviceModel.deleteOne({ _id: _id });

    if (!service) {
        req.status(400);
        throw new Error("Service Data Not Available!, Please Check Again!");
    }

    res.status(200).json({
        status: "Success",
        message: "Service Data Delete Successfully!",
    })
})



module.exports = { createService, getAllService, getoneservice, updateservice, deleteservice }
