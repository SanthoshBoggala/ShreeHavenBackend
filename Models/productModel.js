const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    key : {
        type : String,
        unique: true,
        required : [true, "pls provide key"]
    },
    name : {
        type : String,
        required : [true, "pls provide productName"]
    },
    brand : {
        type : String,
        required : [true, "pls provide productBrand"]
    },
    category : {
        type : String,
        required : [true, "pls provide productcategory"]
    },
    type: {
        type: String,
        required: true
    },
    price : {
        type : Number,
        required : [true, "pls provide price"]
    },
    newPrice : {
        type : Number,
        required : true
    },
    discount : {
        type : Number,
    },
    starRating : {
        type : Number,
        default: 0 
    },
    ratings : {
        type : Number,
        default: 0
    },
    reviews : [{
        review: {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'reviews',
        }
    }],
    description : {
        type : String,
        required : true
    },
    inStock: {
        type: Boolean,
        required: true
    },
    images : {
        type: String,
        required: true
    }
});
productSchema.path('reviews').default([]);

module.exports = mongoose.model("products", productSchema);