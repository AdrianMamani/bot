const db = require("../../../config/db");

const puedeResponder = (text) => {
    return ["hola", "buenas", "menu", "inicio", "informacion"].some(p => text.includes(p));
};

const responder = async (msg) => {

    const [rows] = await db.query("SELECT nombre, url FROM redes_sociales");

    let texto = `
🐝✨ *¡Bienvenid@ a Miel Perú!* ✨🐝

Soy *Lucía 🤖*, tu asesora virtual.
Estoy aquí para ayudarte a descubrir nuestros productos de miel natural 🍯

💛 Todo lo que ofrecemos está elaborado con miel pura y derivados de la colmena, ideales para tu salud y bienestar.


📲 *Síguenos en nuestras redes sociales:*

`;

    rows.forEach(r => {

        const short = r.url
            .replace("https://", "")
            .replace("http://", "")
            .replace("www.", "");

        texto += `*${r.nombre}*\n👉 ${short}\n\n`;
    });

    texto += `
━━━━━━━━━━━━━━━━━━
⚠️🐝 *IMPORTANTE* 🐝⚠️

Si aún no formas parte de la colmena, ¡únete ahora! 🍯✨

Descubre productos naturales, beneficios exclusivos y ofertas especiales.

🌐 *Website:* https://miel.pe
━━━━━━━━━━━━━━━━━━
`;

    await msg.reply(texto);
};

module.exports = { puedeResponder, responder };