const { MessageMedia } = require('whatsapp-web.js');
const db = require("../../../config/db");

const puedeResponder = (text) => {
    return ["redes", "facebook", "instagram", "redes sociales"].some(p => text.includes(p));
};

const responder = async (msg) => {

    const [rows] = await db.query("SELECT nombre, url FROM redes_sociales");

    const media = await MessageMedia.fromUrl(
        "https://miel.pe/assets/bannerRedes.png"
    );

    let texto = "🐝 ¡Únete a nuestra colmena! Descubre el mundo de la miel natural y sé parte de nuestra comunidad 🍯\n\n";

    rows.forEach(r => {

        // 🔥 limpiar URL
        const short = r.url
            .replace("https://", "")
            .replace("http://", "")
            .replace("www.", "");

        texto += `*${r.nombre}*\n👉 ${short}\n\n`;
    });

    const chat = await msg.getChat();

    await chat.sendMessage(media, {
        caption: texto
    });
};

module.exports = {
    puedeResponder,
    responder
};