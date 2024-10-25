const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const dotenv = require("dotenv").config();
const rateLimit = require("express-rate-limit");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Routes
const users = require("./routes/users");
const news = require("./routes/news");

const io = new Server(server, {
  cors: {
    origin: "*",
    allowedHeaders: ["*"],
  },
});

const PORT = process.env.PORT || 3001;

app.use(
  rateLimit({
    max: 100,
    windowMs: 24 * 60 * 60 * 1000,
  })
);

app.use("/api/users", users);
app.use("/api/news", news);

app.get("/", async (req, res) => {
  return res.json({ message: "Hii this is news flash backend" }).status(200);
});

let activeUsers = new Map();

// Socket Connections
io.on("connection", (socket) => {
  console.log("a user connected with id:", socket.id);
  socket.emit("welcome-message", "Welcome in News Flash WS");

  socket.on("user_details", (data) => {
    if (!activeUsers.has(data?.email)) {
      activeUsers.set(data?.email, data);
    }

    console.log(data);
  });

  //last seen event
  socket.on("load_window", (user) => {
    console.log("unload window of user ", user?.id);
    console.log("last seen at ", new Date(Date.now()).toUTCString());

    io.emit("last_seen_event", {
      time: new Date(Date.now()),
      msg: "last seen at ",
    });
  });

  socket.on("unload_window", (user) => {
    console.log("load window");
    io.emit("last_seen_event", {
      msg: `${activeUsers.get(user?.email)?.given_name} active now`,
    });
  });

  socket.on("event:like_post", ({ userId, articleId }) => {
    console.log(`${userId} likes ${articleId}`);

    // socket.emit("event:send_like_notification");
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
