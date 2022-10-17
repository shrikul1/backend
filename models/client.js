const mongoose = require("mongoose")

const clientModal = mongoose.Schema({
    account: {
        type: Number,
        required: [true, "account is Required"]
    },
    username: {
        type: String,
        required: [true, "username is Required"]
    },
    name: {
        type: String,
        required: [true, "name is Required"]
    },
    email: {
        type: String,
        required: [true, "email is Required"]
    },
    password: {
        type: String,
        required: [true, "password is Required"]
    },
    balance: {
        type: Number,
        default: 1000
    },
    type: {
        type: String,
        enum: ["client"],
        default: "client"
    }
}, { timestamps: true })

module.exports = mongoose.model("client", clientModal)