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

//adding socket.io configuration
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server,  {
    cors: {
        origins: ['http://localhost:3000', 'https://eko-diary-nine.vercel.app']
    }
});

app.use(bodyParser.json({limit: "30mb" , extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(express.urlencoded({
    extended: true
}))
app.use( express.static( "./Public" ) );
app.use(cors());
connectDB();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.render("welcome.ejs", {username: "RObert", otp: 123456});
})
app.use("/auth", authRoute);
app.use("/tickets", ticketRoute);
app.use("/events", eventRoute);

io.on('connection', (socket) => {
    //console.log('a user connected', socket.id);

    socket.on("event", (events) => {
        io.emit("new-event", events); 
    })
    socket.on("delete-event", (events) => {
        io.emit("event-deleted", events);
    });
  })
  


mongoose.connection.once("connected", () => {
    server.listen(PORT, () => {
        console.log(` Server running on port ${PORT}`);
      })
})