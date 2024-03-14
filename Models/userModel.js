const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "pls provide username"]
  },
  email: {
    type: String,
    required: [true, "pls provide unique email"],
  },
  type: {
    type: String,
    required: true
  },
  addresses: [{
    address: {
      type: String
    }
  }],
  password: {
    type: String,
    required: [true, "pls provide password"]
  },
})

module.exports = mongoose.model("users", userSchema);