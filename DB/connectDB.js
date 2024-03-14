
const mongoose = require("mongoose");


const connectDB = async (connectUrl)=> {
    return mongoose.connect(connectUrl);
}

module.exports = connectDB;