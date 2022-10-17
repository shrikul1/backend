const express = require('express')
const cors = require('cors')
require("dotenv").config({ path: "./config/.env" })

const db = require("./config/db")
db()

const app = express()
const port = process.env.PORT || 7000

const adminRoutes = require("./routes/adminR")
const clientRoutes = require("./routes/clientR")

app.use(express.json())
app.use(cors())
app.use(express.static("public"))

app.use("/api/admin", adminRoutes)
app.use("/api/client", clientRoutes)


app.listen(port, () => console.log(`Listining \nhttp://localhost:${port}`))