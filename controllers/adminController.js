const jwt = require("jsonwebtoken")
const bcryptjs = require("bcryptjs")
const clientModal = require("../models/client")
// const transactionModal = require("../models/transaction")

exports.adminLogin = async (req, res) => {
    //username,password
    try {
        const admin = await clientModal.findOne({ username: req.body.username })

        if (!admin) {
            return handleError(res, { message: "Wrong email or password!" })
        }

        const validPassword = await bcryptjs.compare(req.body.password, admin.password)

        if (!validPassword) {
            return handleError(res, { message: "Wrong email or password!" })
        }

        if (admin.type != "admin") {
            return handleError(res, { message: "Unauthorised access" })
        }

        const token = jwt.sign({ _id: admin._id }, process.env.JWT_KEY)

        return res.json({
            success: true,
            result: {
                name: admin.name,
                username: admin.username,
                token,
            }
        })

    } catch (error) {
        handleError(res, error)
    }
}

exports.adminCreateNewClient = async (req, res) => {
    try {
       
        if (!req.headers.authorization) {
            return handleError(res, { message: "Please send token" })
        }
        if (!req.body.username) {
            return handleError(res, { message: "client username not found" })
        }
        if (!req.body.password) {
            return handleError(res, { message: "client password not found" })
        }
        if (!req.body.email) {
            return handleError(res, { message: "client email not found" })
        }
        if (!req.body.name) {
            return handleError(res, { message: "client name not found" })
        }
        // if (!req.body.balance) {
        //     return handleError(res, { message: "client balance not found" })
        // }

        const verifyjwt = jwt.verify(req.headers.authorization, process.env.JWT_KEY)

        if (!verifyjwt) {
            return handleError(res, { message: "Invalid token" })
        }

        req.body.password = await bcryptjs.hash(req.body.password, 10)
        req.body.account = Date.now()

        const result = await clientModal.create(req.body)

        res.json({
            success: true,
            result: {
                creation: "New Client Created Successfully",
                newClientAccount: result.account
            }
        })

    } catch (error) {
        handleError(res, error)
    }
}

exports.adminUpdateExistingClient = async (req, res) => {
    //required : id
    //token for auth 
    //name username email 
    try {

        if (!req.headers.authorization) {
            return handleError(res, { message: "Please send token" })
        }

        const { _id } = jwt.verify(req.headers.authorization, process.env.JWT_KEY)

        if (!_id) {
            return handleError(res, { message: "Invalid token" })
        }
        if (!req.body._id || !req.body.name || !req.body.username || !req.body.email) {
            return handleError(res, { message: "Client details not found" })
        }

        const updatedAccount = await clientModal.findByIdAndUpdate({ _id: req.body._id }, {
            name: req.body.name,
            username: req.body.username,
            email: req.body.email
        }, { new: true })
        return res.json({
            success: true,
            result: {
                message: "Client details updated successfully",
                updatedAccount
            }
        })

    } catch (error) {
        handleError(res, error)
    }
}

exports.adminGetAllClients = async (req, res) => {
    try {
        const result = await clientModal.find({ type: "client" }).select("name username account email balance")
        res.json({
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