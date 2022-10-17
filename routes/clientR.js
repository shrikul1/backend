const express = require("express")
const { clientLogin, clientGetAllTransactionDetails, clientUpdateDetails, clientPassword, clientToClientTransaction } = require("../controllers/clientController")
const router = express.Router()

router.route("/alltransactions").get(clientGetAllTransactionDetails)
router.route("/login").post(clientLogin)
router.route("/update").post(clientUpdateDetails)
router.route("/changepassword").post(clientPassword)
router.route("/transaction").post(clientToClientTransaction)

module.exports = router