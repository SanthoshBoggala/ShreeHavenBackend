const mongoose = require('mongoose')

const wishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        }
    }]
})

module.exports = mongoose.model("wishlist", wishListSchema)
