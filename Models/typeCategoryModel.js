const mongoose = require('mongoose');

const typeCategorySchema = new mongoose.Schema({
    type : {
        type: String,
        required: true
    },
    categories: [{
        category: {
            type: String
        }
    }]
})

module.exports = mongoose.model("typecategory", typeCategorySchema);