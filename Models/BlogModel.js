const mongoose = require("mongoose");

const BlogModel = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Please add service title"],
        },
        ImageUrl: {
            type:String,
            
        },
        content: {
            type: "String",  
        },
        author: {
            name: {
                type:String,
            },
            date: {
                type: String
            }
        },
        categories: {
            type: String
        },
        tags: {
            type: [String]
        },
        views: {
            type: String
        }
    },
    {
        timestamps: true, // Corrected to `timestamps` (plural)
    }
);

module.exports = mongoose.model("BlogModel", BlogModel);
