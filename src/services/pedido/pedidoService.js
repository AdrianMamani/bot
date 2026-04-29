const db = require("../../../config/db");

const puedeResponder = (text) => {
  return /cliente[\s\S]*telefono[\s\S]*total/i.test(text);
};

const responder = async (msg) => {
  try {
    // sacar teléfono escrito en mensaje
    const match = msg.body.match(/Telefono:\s*(\d+)/i);
    const telefono = match ? match[1] : null;

    console.log("telefono pedido:", telefono);
    console.log("chat id:", msg.from);

    // guardar chat_id en pedido pendiente
    if (telefono) {
      await db.query(
        `UPDATE pedidos_temporales
         SET chat_id = ?
         WHERE telefono = ?
         AND estado = 'pendiente'
         ORDER BY id DESC
         LIMIT 1`,
        [msg.from, telefono]
      );
    }

    // medios de pago
    const [rows] = await db.query(
      "SELECT nombre, numero, remitente FROM medios_pago WHERE activo = 1"
    );

    let texto = `🐝✨ ¡Pedido recibido con éxito! ✨🐝\n\n`;
    texto += `💳 Medios de pago disponibles:\n\n`;

    rows.forEach((p) => {
      const nombre = p.nombre.toLowerCase();

      if (nombre === "yape") {
        texto += `Yape\n📲 ${p.numero}\n👤 Remitente: ${p.remitente}\n\n`;
      } else if (nombre === "plin") {
        texto += `Plin\n📲 ${p.numero}\n👤 Remitente: ${p.remitente}\n\n`;
      } else {
        texto += `${p.nombre}\n📲 ${p.numero}\n👤 Remitente: ${p.remitente}\n\n`;
      }
    });

    texto += `📸 Importante:\nEnvía tu comprobante para procesar el pago 🚀`;

    await msg.reply(texto);

  } catch (error) {
    console.error(error);
    await msg.reply("Error procesando pedido.");
  }
};

module.exports = {
  puedeResponder,
  responder
};