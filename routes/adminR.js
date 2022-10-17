const express = require("express")
const { adminLogin, adminCreateNewClient, adminUpdateExistingClient, adminGetAllClients } = require("../controllers/adminController")
const router = express.Router()

router.route("/login").post(adminLogin)
router.route("/newclient").post(adminCreateNewClient)
router.route("/updateclient").post(adminUpdateExistingClient)
router.route("/getallclients").get(adminGetAllClients)

module.exports = router