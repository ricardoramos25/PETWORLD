// src/components/Navbar.jsx
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import Perfil from "./Perfil"
import UserAvatar from "./UserAvatar"
import { guardarConsultaMedica } from "../firebase/config"
import { abrirWhatsAppUrl } from "../services/whatsappService"

const ADMIN_WHATSAPP = (import.meta.env.VITE_WHATSAPP_ADMIN_NUMBER || "50499288926").replace(/\D/g, "")

function Navbar({ carrito, abrirCarrito }) {
  const { usuario, estaAutenticado } = useAuth()
  const [mostrarPerfil, setMostrarPerfil] = useState(false)
  const navigate = useNavigate()

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  const handleGoHome = () => {
    navigate("/", { replace: true })
    scrollToTop()
    requestAnimationFrame(scrollToTop)
    setTimeout(scrollToTop, 60)
  }

  const handleConsultaMedica = async () => {
    if (!ADMIN_WHATSAPP) {
      alert("Falta configurar VITE_WHATSAPP_ADMIN_NUMBER para enviar mensajes por WhatsApp")
      return
    }

    // Guardar en base de datos
    if (estaAutenticado && usuario) {
      await guardarConsultaMedica(usuario.id, usuario.nombre, usuario.email)
    }
    
    // Abrir WhatsApp
    const mensaje = `Buen Dia tengo una consulta sobre mi compra`
    const mensajeCodificado = encodeURIComponent(mensaje)
    abrirWhatsAppUrl(`https://wa.me/${ADMIN_WHATSAPP}?text=${mensajeCodificado}`)
    navigate("/")
  }

  return (
    <>
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800/95 text-white px-3 py-3 sm:p-4 shadow-lg sticky top-0 z-40 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleGoHome}
            title="Ir al inicio"
            aria-label="Ir al inicio"
            className="relative z-50 shrink-0 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/30 to-white/15 hover:from-orange-500/45 hover:to-white/25 border border-orange-200/70 ring-1 ring-white/60 shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_0_0_3px_rgba(249,115,22,0.45),0_10px_24px_rgba(249,115,22,0.28)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.65),0_0_0_3px_rgba(249,115,22,0.65),0_12px_28px_rgba(249,115,22,0.4)] active:scale-[0.98] transition-all duration-200 min-w-0 cursor-pointer"
          >
            <img
              src={`${import.meta.env.BASE_URL}public/logo-petworld.png.jpeg`}
              alt="PetWorld"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white/30 shrink-0"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="min-w-0 text-left">
              <span className="block text-lg sm:text-2xl font-bold truncate leading-none">PetWorld</span>
              <span className="flex items-center gap-1 text-[11px] text-gray-100/95">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 3.17 3 10.2V21h6.5v-5.5h5V21H21V10.2z" />
                </svg>
                Inicio
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {estaAutenticado ? (
            <button
              onClick={() => setMostrarPerfil(true)}
              className="bg-purple-500 p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
            >
              <UserAvatar usuario={usuario} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
              <span className="text-sm truncate hidden sm:inline">{usuario?.nombre?.split(" ")[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-700 p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
              <span className="hidden sm:inline">Iniciar sesión</span>
            </button>
          )}
          
          <button
            onClick={handleConsultaMedica}
            className="relative inline-flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-400 via-green-500 to-lime-500 text-gray-900 shadow-[0_0_20px_rgba(34,197,94,0.45)] ring-1 ring-emerald-200/40 hover:scale-105 hover:shadow-[0_0_28px_rgba(34,197,94,0.65)] active:scale-95 transition-all duration-300"
            title="Consulta sobre su compra"
          >
            <span className="text-base animate-bounce">🩺</span>
            <span className="hidden sm:block leading-tight text-left">
              <span className="block">Consulta sobre su compra</span>
              <span className="block text-[10px] font-medium text-gray-800/80">Respuesta por WhatsApp</span>
            </span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-lime-200 opacity-75 animate-ping"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-100"></span>
            </span>
          </button>
          
          <button 
            onClick={abrirCarrito}
            className="relative bg-blue-500 p-2 sm:px-3 sm:py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          >
            🛒
            {totalItems > 0 && (
              <>
                <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                  {totalItems}
                </span>
                <span className="hidden sm:inline text-sm">
                  L {totalPrecio}
                </span>
              </>
            )}
          </button>
          </div>
        </div>
      </nav>
      
      {mostrarPerfil && (
        <Perfil onClose={() => setMostrarPerfil(false)} />
      )}
    </>
  )
}

export default Navbar