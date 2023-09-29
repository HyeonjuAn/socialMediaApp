const express = require("express");
const rateLimit = require("express-rate-limit");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dbConnect = require("./config/db");
const SocketHandler = require("./config/SocketHandler");
const apiRoute = require("./routes/Api");
require("dotenv").config();

apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    handler: function(req, res) {
        return res.status(429).json({
            message: "Too many requests, please try again later.",
        });
    },
});

const app = express();
const server = http.Server(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

// Connect to MongoDB
dbConnect();

// Check if the connection is successful
mongoose.connection.once("open", () => {
    server.listen(3500, () => {
        console.log("Server started on port 3500");
    });
});

// Socket.io
SocketHandler(io);

app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/api/", apiLimiter);
app.use("/api/", apiRoute);
