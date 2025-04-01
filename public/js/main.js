const socket = io();

document.getElementById("createRoom").addEventListener("click", () => {
    socket.emit("createRoom");
});

document.getElementById("joinRoom").addEventListener("click", () => {
    const code = document.getElementById("roomCode").value;
    const username = prompt("Ingresa tu nombre:");
    socket.emit("joinRoom", { code, username });
});

socket.on("roomCreated", (code) => {
    document.getElementById("status").innerText = "Código de sala: " + code;
});

socket.on("playerJoined", (msg) => {
    document.getElementById("status").innerText = msg;
});

socket.on("displayMessage", (msg) => {
    const li = document.createElement("li");
    li.innerText = msg;
    document.getElementById("messages").appendChild(li);
    console.log(msg);
});

socket.on("error", (msg) => {
    alert(msg);
});
