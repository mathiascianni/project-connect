if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then((registration) => {
            console.log('Service Worker registrado con éxito:', registration);
        }).catch((error) => {
            console.log('Error al registrar el Service Worker:', error);
        });
    });
}

const socket = io();
let roomCode = "";
let username = "";

const connectScreen = document.getElementById("connectScreen");
const controlScreen = document.getElementById("controlScreen");

// Unirse a una sala
document.getElementById("joinRoom").addEventListener("click", () => {
    roomCode = document.getElementById("roomCode").value;
    username = document.getElementById("username").value;

    if (!roomCode || !username) {
        alert("Ingresa un código y tu nombre");
        return;
    }

    socket.emit("joinRoom", { code: roomCode, username });

    // Ocultamos la pantalla de conexión y mostramos la de control
    connectScreen.classList.add("hidden");
    controlScreen.classList.remove("hidden");

    // Esperamos a que el usuario ponga el móvil en horizontal
    screen.orientation.lock("landscape").catch(() => {
        alert("Gira el dispositivo manualmente a horizontal");
    });

    renderControls();
});

// Genera los botones de control
function renderControls() {
    controlScreen.innerHTML = `
        <div class="flex w-full h-full">
            <!-- Controles de Flechas -->
            <div class="w-1/2 grid grid-cols-3 grid-rows-3 gap-2 p-4">
                <button onclick="sendAction('⬆️ Arriba')" class="row-start-1 col-start-2 btn">⬆️</button>
                <button onclick="sendAction('⬅️ Izquierda')" class="row-start-2 col-start-1 btn">⬅️</button>
                <button onclick="sendAction('➡️ Derecha')" class="row-start-2 col-start-3 btn">➡️</button>
                <button onclick="sendAction('⬇️ Abajo')" class="row-start-3 col-start-2 btn">⬇️</button>
            </div>

            <!-- Botones de Acción -->
            <div class="w-1/2 flex flex-col items-center justify-center space-y-4 p-4">
                <button onclick="sendAction('🅰️ Botón A')" class="action-btn">🅰️</button>
                <button onclick="sendAction('🅱️ Botón B')" class="action-btn">🅱️</button>
            </div>
        </div>
    `;
}

// Envía la acción presionada al servidor
function sendAction(action) {
    if (roomCode) {
        socket.emit("buttonPressed", { room: roomCode, username, action });
    }
}

socket.on("playerJoined", (msg) => {
    alert(msg);
});
