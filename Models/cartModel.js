const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    items: [{
        product : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true,
            unique: true
        }
    }]
})

module.exports = mongoose.model("cart", cartSchema);