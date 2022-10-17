const mongoose = require("mongoose")

const transactionModal = mongoose.Schema({
    from: {
        type: String,
        required: [true, "from is required"]
    },
    to: {
        type: String,
        required: [true, "to is required"]
    },
    amount: {
        type: String,
        required: [true, "amount is required"]
    },

}, { timestamps: true })


module.exports = mongoose.model("transaction", transactionModal)