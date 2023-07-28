// app.js
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/userroute");
const cryptoRoute = require("./routes/cryptoroute");
const socketIo = require("socket.io");
const http = require("http");
const initSocketIO = require("./socketServer");
const socketIO = require("socket.io");
const cron = require("cron");
const socketIOClient = require("socket.io-client");
const { getCryptoUpdates } = require("./contoller/cryptoController"); // Import the getCryptoUpdates function

dotenv.config();
require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//connecting to db
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_MONGO)
  .then(async () => {
    console.log("CONNECTED TO DB");

    // Seeding the database with initial crypto data
    await getCryptoUpdates(); // Call the getCryptoUpdates function

    // Start the Express server after the database connection is established
    const PORT = process.env.BACKEND_PORT || 5000;
    const server = http.createServer(app);
    const io = socketIo(server);

    initSocketIO(io); // Initialize socket.io handlers

    io.on("connection", (socket) => {
      console.log("A user connected");

      // Example: Send real-time data to the client
      socket.emit("cryptoUpdate", { message: "Real-time crypto data" });

      // Example: Receive data from the client
      socket.on("clientEvent", (data) => {
        console.log("Data received from client:", data);
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });

    const socket = socketIOClient("http://localhost:5000"); // Replace with the correct server URL

    const job = new cron.CronJob("* * * * *", async () => {
      try {
        const cryptosData = await getCryptoUpdates(); // Call the getCryptoUpdates function
        const updatedCryptos = cryptosData.map((crypto) => ({
          id: crypto.symbol, // Assuming "symbol" can be used as a unique identifier
          ...crypto,
        }));
        // Emit real-time updates to the connected clients using Socket.IO
        socket.emit("cryptoUpdate", updatedCryptos);
      } catch (error) {
        console.error("Error fetching data from the API:", error.message);
      }
    });

    job.start();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));

// Middleware
app.use("/user", userRoute);
app.use("/api/crypto", cryptoRoute);

module.exports = app;
