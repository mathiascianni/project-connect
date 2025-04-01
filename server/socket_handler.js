let rooms = {}; // Almacena salas y jugadores

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("Usuario conectado:", socket.id);

        socket.on("createRoom", () => {
            const code = Math.random().toString(36).substr(2, 5);
            rooms[code] = {};
            socket.join(code);
            socket.emit("roomCreated", code);
        });

        socket.on("joinRoom", ({ code, username }) => {
            if (rooms[code]) {
                rooms[code][socket.id] = username;
                socket.join(code);
                io.to(code).emit("playerJoined", `${username} se unió a la sala`);
            } else {
                socket.emit("error", "Código no válido");
            }
        });

        socket.on("buttonPressed", ({ room, username, action }) => {
            io.to(room).emit("displayMessage", `🎮 ${username} presionó ${action}`);
        });

        socket.on("disconnect", () => {
            for (const room in rooms) {
                if (rooms[room][socket.id]) {
                    const username = rooms[room][socket.id];
                    delete rooms[room][socket.id];
                    io.to(room).emit("displayMessage", `${username} salió de la sala`);
                }
            }
        });
    });
};
