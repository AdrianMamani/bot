const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { iniciarBot } = require("./src/core/bot");

const app = express();
const server = http.createServer(app);

// Guardaremos el QR aquí temporalmente para mostrarlo en la web
let qrDinamico = ""; 

const io = new Server(server, {
    cors: { origin: "*" }
});

global.io = io;

// --- NUEVO: Ruta para ver el QR ---
app.get('/scan', (req, res) => {
    if (qrDinamico) {
        res.send(`
            <html>
                <body style="background: #111; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
                    <h2>Escanea el QR para iniciar el Bot</h2>
                    <img src="${qrDinamico}" style="background: white; padding: 20px; border-radius: 10px;">
                    <p style="margin-top: 20px;">Refresca la página si el código expira.</p>
                </body>
            </html>
        `);
    } else {
        res.send('<h2>El bot ya está conectado o el QR aún no se genera.</h2>');
    }
});

// Ruta de salud para Cron-job.org
app.get('/ping', (req, res) => res.send('pong'));

// Escuchamos el evento QR desde tu lógica de bot
io.on("connection", (socket) => {
    socket.on("qr_update", (base64) => {
        qrDinamico = base64;
    });
});

server.listen(process.env.PORT || 8000, () => {
    console.log("🚀 Backend running");
    iniciarBot();
});