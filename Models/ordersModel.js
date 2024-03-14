const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required : [true, "pls provide userId"],
    },
    product : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true,

    },
    size : {
        type: String,
    },
    count: {
        type: Number,
        required: true
    },
    color: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    address: {
        type: String
    },
    paymentMethod: {
        type: String
    },
    status : {
        type: String,
        default: "Pending",
        enum: ['Pending', 'Failed', 'Return', 'Delivered', 'Return Pending'], 
    },
    orderedDate: {
        type: Date,
        default: Date.now()
    },
    deliveredDate : {
        type: Date
    }
})

module.exports = mongoose.model("orders", orderSchema);