//require the express module
const express = require("express");
const app = express();
const chatRouter = require("./route/chatroute");
//database connection
const Chat = require("./models/Chat");
const connect = require("./dbconnect");
//require the http module
const http = require("http").Server(app);

// require the socket.io module
const io = require("socket.io");

const port = 5000;

//bodyparser middleware
app.use(express.json());

//routes
app.use("/chats", chatRouter);

//set the express.static middleware
app.use(express.static(__dirname + "/public"));

//integrating socketio
socket = io(http);



//setup event listener
socket.on("connection", socket => {

  socket.on("disconnect", function () {
    console.log("user disconnected");
  });

  //Someone is typing
  socket.on("typing", data => {
    socket.broadcast.emit("notifyTyping", {
      user: data.user,
      message: data.message
    });
  });

  //when soemone stops typing
  socket.on("stopTyping", () => {
    socket.broadcast.emit("notifyStopTyping");
  });

  socket.on("chat message", async function (msg) {
    //save chat to the database
    let chatMessage = new Chat({ message: msg, sender: "Anonymous" });
    await chatMessage.save();

    //broadcast message to everyone in port:5000 except yourself.
    socket.broadcast.emit("received", { message: msg });

  });
});

http.listen(port, async () => {
  connect
    .then(() => {
      console.log("Successfully connected to MongoDB");
    })
    .catch(err => {
      console.error("Error connecting to MongoDB", err);
    });

  console.log("Running on Port: " + port);
});
