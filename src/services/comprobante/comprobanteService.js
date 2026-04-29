const axios = require("axios");

const puedeResponder = (text, msg) => {
  return msg.hasMedia;
};

const responder = async (msg) => {
  try {
    console.log("FROM:", msg.from);
    console.log("AUTHOR:", msg.author);
    console.log("BODY:", msg.body);
    console.log("TYPE:", msg.type);

    const chatId = msg.from;

    const { data: pedido } = await axios.get(
      `http://localhost:4000/api/pedido-temporal/chat/${encodeURIComponent(chatId)}`
    );

    if (!pedido) {
      await msg.reply("No encontré pedido pendiente.");
      return;
    }

    const productos = Array.isArray(pedido.productos)
  ? pedido.productos
  : JSON.parse(pedido.productos);

    await axios.post(
      "http://localhost:4000/api/venta/finalizar",
      { productos }
    );

    await axios.put(
      `http://localhost:4000/api/pedido-temporal/pagado/${pedido.id}`
    );

    await msg.reply("✅ Pago confirmado.");

  } catch (error) {
    console.error(error.response?.data || error.message);
    await msg.reply("Error procesando comprobante.");
  }
};

module.exports = {
  puedeResponder,
  responder
};