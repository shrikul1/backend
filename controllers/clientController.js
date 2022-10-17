const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const clientModal = require("../models/client")
const transactionModal = require("../models/transaction")



exports.clientLogin = async (req, res) => {
    //username password
    try {
        const client = await clientModal.findOne({ username: req.body.username })

        if (!client) {
            return handleError(res, { message: "Wrong email or password!" })
        }

        const validPassword = await bcryptjs.compare(req.body.password, client.password)

        if (!validPassword) {
            return handleError(res, { message: "Wrong email or password!" })
        }

        if (client.type != "client") {
            return handleError(res, { message: "Unauthorised access" })
        }

        const token = jwt.sign({ _id: client._id }, process.env.JWT_KEY)

        return res.json({
            success: true,
            result: {
                name: client.name,
                username: client.username,
                email: client.email,
                account: client.account,
                balance: client.balance,
                token,
            }
        })

    } catch (error) {
        handleError(res, error)
    }
}

exports.clientUpdateDetails = async (req, res) => {
    //email password username token
    try {
        if (!req.headers.authorization) {
            return handleError(res, { message: "Please provide token" })
        }
        if (!req.body.email || !req.body.username || !req.body.password) {
            return handleError(res, { message: "Please provide all details" })
        }

        const { _id } = jwt.verify(req.headers.authorization, process.env.JWT_KEY)

        if (!_id) {
            return handleError(res, { message: "Invalid Token" })
        }

        const client = await clientModal.findOne({ _id })

        const verifyPassword = await bcryptjs.compare(req.body.password, client.password)

        if (!verifyPassword) {
            return handleError(res, { message: "Invalid Password" })
        }

        await clientModal.findByIdAndUpdate({ _id }, { email: req.body.email, username: req.body.username })

        res.json({
            success: true,
            result: "Client details updated successfully"
        })

    } catch (error) {
        handleError(res, error)
    }
}

exports.clientPassword = async (req, res) => {
    //old_password token new_password 
    try {
        if (!req.headers.authorization) {
            return handleError(res, { message: "Please provide token" })
        }
        const { _id } = jwt.verify(req.headers.authorization, process.env.JWT_KEY)

        if (!_id) {
            return handleError(res, { message: "Invalid Token" })
        }

        const client = await clientModal.findOne({ _id })

        const verifyPassword = await bcryptjs.compare(req.body.oldpassword, client.password)

        if (!verifyPassword) {
            return handleError(res, { message: "Invalid Old Password" })
        }

        const newPassword = await bcryptjs.hash(req.body.newpassword, 10)

        await clientModal.findByIdAndUpdate({ _id: client._id }, { password: newPassword })
        res.json({
            success: true,
            result: "Password changed successfully"
        })


    } catch (error) {
        handleError(res, error)
    }
}

exports.clientToClientTransaction = async (req, res) => {
    //username account_number amount
    //sender token  
    try {
        if (!req.headers.authorization) {
            return handleError(res, { message: "Please provide token" })
        }
        const { _id } = jwt.verify(req.headers.authorization, process.env.JWT_KEY)
        if (!_id) {
            return handleError(res, { message: "Invalid token" })
        }
        if (!req.body.amount) {
            return handleError(res, { message: "Please send amount" })
        }
        if (!req.body.username) {
            return handleError(res, { message: "Please send username" })
        }
        if (!req.body.account) {
            return handleError(res, { message: "Please send account" })
        }

        const sender = await clientModal.findOne({ _id })
        const receiver = await clientModal.findOne({ username: req.body.username, account: req.body.account })

        if (req.body.amount > sender.balance) {
            return handleError(res, { message: "User don't have enough balance to transfer funds" })
        }
        if (!receiver) {
            return handleError(res, { message: "Reciver Not Found" })
        }

        // sender.balance -= amount
        // receiver.balance += amount

        await clientModal.findByIdAndUpdate({ _id: sender._id }, { $inc: { balance: -req.body.amount } })
        await clientModal.findByIdAndUpdate({ _id: receiver._id }, { $inc: { balance: req.body.amount } })

        const transactionDetails = await transactionModal.create({ from: sender.account, to: receiver.account, amount: req.body.amount })

        res.json({
            success: true,
            result: {
                to: transactionDetails.to,
                from: transactionDetails.from,
                amount: transactionDetails.amount
            }
        })

    } catch (error) {
        handleError(res, error)
    }
}

exports.clientGetAllTransactionDetails = async (req, res) => {
    // token 
    try {
        if (!req.headers.authorization) {
            return handleError(res, { message: "Please provide token" })
        }
        const { _id } = jwt.verify(req.headers.authorization, process.env.JWT_KEY)

        if (!_id) {
            return handleError(res, { message: "Invalid Token" })
        }

        const client = await clientModal.findOne({ _id })
        const result = await transactionModal.find({ from: client.account })
        return res.json({
            success: true,
            result
        })

    } catch (error) {
        handleError(res, error)
    }
}

const handleError = (res, error) => {
    return res.status(400).json({
        success: false,
        error: "Error " + error.message
    })
}