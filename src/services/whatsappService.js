// src/services/whatsappService.js

const ADMIN_WHATSAPP = (import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER || "50499288926").replace(/\D/g, "");

export const abrirWhatsAppUrl = (whatsappUrl) => {
  try {
    const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    if (popup) {
      return { opened: true, mode: "new-tab" };
    }

    window.location.assign(whatsappUrl);
    return { opened: true, mode: "same-tab" };
  } catch (error) {
    window.location.assign(whatsappUrl);
    return { opened: true, mode: "same-tab", error };
  }
};

const crearMensajePedido = (pedido, usuario) => {
  const fecha = new Date().toLocaleString();

  let mensaje = `NUEVO PEDIDO - PETWORLD\n\n`;
  mensaje += `Fecha: ${fecha}\n`;
  mensaje += `Cliente: ${usuario?.nombre || "Cliente no registrado"}\n`;
  mensaje += `Email: ${usuario?.email || "No disponible"}\n`;
  mensaje += `Telefono: ${usuario?.telefono || "No especificado"}\n`;
  mensaje += `Direccion: ${usuario?.direccion || "No especificada"}\n`;
  mensaje += `Ciudad: ${usuario?.ciudad || "No especificada"}\n\n`;
  mensaje += `PRODUCTOS:\n`;
  mensaje += `-------------------------\n`;

  if (pedido?.productos && pedido.productos.length > 0) {
    pedido.productos.forEach((item, index) => {
      const subtotal = (item.precio || 0) * (item.cantidad || 1);
      mensaje += `${index + 1}. ${item.nombre}\n`;
      mensaje += `   ${item.cantidad} x L ${item.precio} = L ${subtotal}\n`;
    });
  } else {
    mensaje += `${pedido?.pedido || "Sin productos"}\n`;
  }

  mensaje += `-------------------------\n`;
  mensaje += `TOTAL: L ${pedido?.total || 0}\n`;
  mensaje += `Pago: ${pedido?.metodoPago || "Pendiente"}\n`;
  mensaje += `Estado: Pendiente de confirmacion\n`;
  mensaje += `ID Pedido: ${pedido?.id || "Nuevo"}\n`;

  return mensaje;
};

export const enviarPedidoPorWhatsApp = async (pedido, usuario) => {
  if (!ADMIN_WHATSAPP) {
    return {
      success: false,
      message: "Falta configurar VITE_WHATSAPP_ADMIN_NUMBER"
    };
  }

  if (ADMIN_WHATSAPP.length < 8) {
    return {
      success: false,
      message: "VITE_WHATSAPP_ADMIN_NUMBER tiene un formato invalido"
    };
  }

  const mensaje = crearMensajePedido(pedido, usuario);
  const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  abrirWhatsAppUrl(whatsappUrl);

  return {
    success: true,
    message: "Pedido preparado y enviado por enlace de WhatsApp",
    url: whatsappUrl
  };
};