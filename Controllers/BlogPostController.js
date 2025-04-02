
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const BlogModel = require("../Models/BlogModel");


const createBlogPost = asyncHandler(async (req, res)=> {
    const { title, imageUlr, author, tags, categories } = req.body;

    const post = await BlogModel.create(req.body)

    if(!post){
        res.status(400);
        throw new Error("Something Went Wrong");
    }

    res.status(200).json({
        status:"Success",
        message: "Blog Post Created!",
        data: post
    })
})

// get one user data 
const getOnePost = asyncHandler(async (req, res) => {

    const { _id } = req.params;
    
    const getPost = await BlogModel.findById({ _id });

    if (!getPost) {
        res.status(400);
        throw new Error("Blog post Data not Found! Pleach Check your Id ")
    }

    res.status(200).json({
        status: "sucess",
        message: "Get One blog Data Successfully!",
        data: getPost,
    })

})  

// update one user details
const updateBlogPost = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    console.log("req.body", req.body);
    const {  title, ImageUrl, content } = req.body;

    if (!_id) {
        res.status(400);
        throw new Error("_id Not Found, Something went Wrong!")
    }

    const updateddata = await BlogModel.findByIdAndUpdate(
        { _id: _id },
        { $set: { title:title, ImageUrl:ImageUrl, content:content }},
        { returnDocument: "after", upsert: true }
    )

    if (!updateddata) {
        res.status(400)
        throw new Error("User data not found!")
    }

    res.status(200).json({
        message: "Successfully Update Current Blog Post data",
        data: updateddata
    })
})

// update and Delete 
const deleteBlogPost = asyncHandler(async (req, res) => {
    const { _id } = req.params;

    if (!_id) {
        res.status(401);
        throw new Error("blog Details not valid!")
    }

    // check service for new user 
    const blog = await BlogModel.findById({ _id:_id });

    if (!blog){
        res.status(401);
        throw new Error("blog Not Available")
    }

    const blogPost = await BlogModel.deleteOne({ _id: _id });

    if (!blogPost) { 
        req.status(400);
        throw new Error("blog Data Not Available!, Please Check Again!");
    }

    res.status(200).json({
        status: "Success",
        message: "blog Data Delete Successfully!",
    })
})

const getAllBlogPost = asyncHandler(async(req, res)=> {
    console.log("blogs")

    const blogs = await BlogModel.find();

    if(!blogs){
        res.status(400);
        throw new Error("Somethig Went wrong");
    }


    res.status(200).json({
        status: "success",
        message: "User post find successfully!",
        data: blogs
    })
})


module.exports = { createBlogPost, updateBlogPost, deleteBlogPost, getOnePost, getAllBlogPost }