const comprobanteService = require("../services/comprobante/comprobanteService");
const pedidoService = require("../services/pedido/pedidoService");
const redesService = require("../services/redes/redesService");
const saludoService = require("../services/saludo/saludoService");

const servicios = [
  comprobanteService,
  pedidoService,
  redesService,
  saludoService
];

const manejarMensaje = async (msg) => {
  const text = (msg.body || "").toLowerCase();

  console.log("📩", msg.body);

  for (let service of servicios) {
    // 👇 ahora sí mandamos msg también
    if (service.puedeResponder(text, msg)) {
      await service.responder(msg);
      return;
    }
  }
};

module.exports = { manejarMensaje };