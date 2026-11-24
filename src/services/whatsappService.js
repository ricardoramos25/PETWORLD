// src/services/whatsappService.js

// Número de WhatsApp que recibe las consultas y productos seleccionados
const WHATSAPP_DESTINO = "50499288926";

export const abrirWhatsAppUrl = (whatsappUrl) => {
  window.location.assign(whatsappUrl);
  return { opened: true, mode: "same-tab" };
};

const crearMensajePedido = (pedido, usuario) => {
  const fecha = new Date().toLocaleString();

  let mensaje = `HOLA, QUIERO ESTOS PRODUCTOS - PETWORLD\n\n`;
  mensaje += `Fecha: ${fecha}\n\n`;
  mensaje += `PRODUCTOS SELECCIONADOS:\n`;
  mensaje += `-------------------------\n`;

  if (pedido?.productos && pedido.productos.length > 0) {
    pedido.productos.forEach((item, index) => {
      mensaje += `${index + 1}. ${item.nombre} (Cantidad: ${item.cantidad || 1})\n`;
    });
  } else {
    mensaje += `Sin productos seleccionados\n`;
  }

  mensaje += `-------------------------\n`;

  return mensaje;
};

export const enviarPedidoPorWhatsApp = async (pedido, usuario) => {
  if (!WHATSAPP_DESTINO) {
    return {
      success: false,
      message: "No hay un número de WhatsApp configurado"
    };
  }

  if (WHATSAPP_DESTINO.length < 8) {
    return {
      success: false,
      message: "El número de WhatsApp tiene un formato inválido"
    };
  }

  const mensaje = crearMensajePedido(pedido, usuario);
  const whatsappUrl = `https://wa.me/${WHATSAPP_DESTINO}?text=${encodeURIComponent(mensaje)}`;

  abrirWhatsAppUrl(whatsappUrl);

  return {
    success: true,
    message: "Pedido preparado y enviado por enlace de WhatsApp",
    url: whatsappUrl
  };
};