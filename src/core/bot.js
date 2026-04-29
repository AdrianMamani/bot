const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const { manejarMensaje } = require("../handlers/messageHandler");

const iniciarBot = () => {
    const client = new Client({
        authStrategy: new LocalAuth({
            dataPath: "./auth"
        }),
        // --- ESTO ES LO QUE DEBES AGREGAR ---
        puppeteer: {
            handleSIGINT: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ],
        }
    });

    // 📱 QR → frontend
    client.on('qr', async (qr) => {
        try {
            const qrImage = await qrcode.toDataURL(qr);
            if (global.io) {
                global.io.emit("qr", qrImage);
                // Guardamos una copia global para la ruta /scan que te sugerí antes
                global.currentQr = qrImage; 
            }
        } catch (err) {
            console.error("Error generando QR:", err);
        }
    });

    client.on('ready', () => {
        console.log("✅ Bot listo y conectado");
        global.currentQr = null; // Limpiamos el QR
        if (global.io) {
            global.io.emit("ready", "conectado");
        }
    });

    client.on('message', manejarMensaje);

    client.initialize();
};

module.exports = { iniciarBot };