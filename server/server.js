const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socket_handler");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Servimos archivos estáticos desde `public`
app.use(express.static("public"));

// Lógica de WebSockets separada en otro archivo
socketHandler(io);

server.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});
