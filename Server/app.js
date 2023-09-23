const express = require("express")
const app = express()
const connectDatabase = require("./config/db.js")
const userRoute = require("./routes/userRoute.js")
const cors = require("cors")
const cookieParser = require('cookie-parser')
app.use(cors({
    origin:"http://localhost:5500",
    credentials:true
}))
// app.use((req, res, next) => { res.header({"Access-Control-Allow-Origin": "http://localhost:5500"}); next(); })
connectDatabase()
app.use(cookieParser())
app.use(express.json())
app.use("/api/user", userRoute)
app.use('/', (req, res)=>{
    console.log("Server Starting on PORT :",process.env.PORT);
})
module.exports = app