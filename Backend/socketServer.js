const socketIO = require("socket.io");

// Initialize a new Socket.IO instance
const initSocketIO = (server) => {
  const io = socketIO(server);

  // Handle incoming socket connections
  io.on("connection", (socket) => {
    console.log("A new client connected!");

    // You can define custom events and handle them here
    // For example, you can listen for updates from the client and send real-time data in response
    // socket.on("eventName", (data) => {
    //   // Handle the event and send real-time updates back to the client
    //   io.emit("eventName", eventData);
    // });

    // When the client disconnects
    socket.on("disconnect", () => {
      console.log("A client disconnected!");
    });
  });

  return io;
};

module.exports = initSocketIO;
