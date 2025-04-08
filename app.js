const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
// const Razorpay = require("razorpay");
const errorHandler = require("./Middlewares/errorHandler");
const connectDb = require("./Config/DbController");
connectDb();

const app = express();
// app.use(cors());
app.use(cors());



app.use(express.json()); // it helps to console req.body data in console 

// setting the port usign env file using dotenc package
const port = process.env.PORT || 5001;

// all student authentication
app.use("/api/service", require("./Routes/ServiceRoutes"));

// img file to url 
app.use("/api/img", require("./Routes/ImgToUrlRoutes"));

// packages api route
app.use("/api/package", require("./Routes/PackageRoutes"));

// blog post api router
app.use("/api/blog", require("./Routes/BlogRoutes"));

// admin authentication 
app.use("/api/auth", require("./Routes/AuthRoutes"))


// error handler middleware user to conver error html formate to json formate 
// app.use(errorHandler);

// app listen or port 
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})