const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotEnv = require("dotenv");


dotEnv.config();
const app = express();
const connectDB = require("./dbConfig");
const authRoute = require("./Routes/authRoutes");
const ticketRoute = require("./Routes/genertae-ticket");
const eventRoute = require("./Routes/event");
const { firebaseConfig } = require("./Util/firebase_config");

app.use(bodyParser.json({limit: "30mb" , extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(express.urlencoded({
    extended: true
}))
app.use(cors());
connectDB();

const PORT = process.env.PORT || 5000;
// Import the functions you need from the SDKs you need



// Initialize Firebase



app.get("/", (req, res) => {
    res.send("Eko-Diary is running");
})
app.use("/auth", authRoute);
app.use("/tickets", ticketRoute);
app.use("/events", eventRoute);

mongoose.connection.once("connected", () => {
    app.listen(PORT, () => {console.log("server running on:" + PORT)})
})