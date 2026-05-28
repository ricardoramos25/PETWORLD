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
  const [mostrarRedes, setMostrarRedes] = useState(false)
  const navigate = useNavigate()

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0)
  const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  const handleGoHome = () => {
    setMostrarRedes(false)
    navigate("/", { replace: true })
    scrollToTop()
    requestAnimationFrame(scrollToTop)
    setTimeout(scrollToTop, 60)
  }

  const redesSociales = [
    {
      id: "whatsapp",
      nombre: "WhatsApp",
      href: "https://wa.me/50499288926",
      color: "text-green-400",
      icono: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07.02C5.54.02.22 5.35.22 11.88c0 2.1.55 4.15 1.6 5.96L.03 24l6.32-1.66a11.8 11.8 0 0 0 5.72 1.46h.01c6.53 0 11.85-5.33 11.85-11.86 0-3.17-1.24-6.15-3.41-8.46zM12.08 21.8h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.75.99 1-3.66-.23-.38a9.8 9.8 0 0 1-1.5-5.29c0-5.42 4.41-9.84 9.85-9.84 2.63 0 5.1 1.03 6.96 2.9a9.78 9.78 0 0 1 2.87 6.95c0 5.43-4.42 9.85-9.86 9.85zm5.4-7.38c-.3-.15-1.77-.87-2.04-.96-.27-.1-.47-.15-.67.15-.2.29-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.48a8.95 8.95 0 0 1-1.66-2.07c-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.48s1.08 2.88 1.23 3.08c.15.2 2.12 3.24 5.13 4.54.72.3 1.28.48 1.72.62.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"/>
        </svg>
      )
    },
    {
      id: "instagram",
      nombre: "Instagram",
      href: "https://www.instagram.com/petworld.hn?igsh=MXFjczBuaHd1ODB5MA==",
      color: "text-pink-400",
      icono: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.9 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65z"/>
        </svg>
      )
    },
    {
      id: "facebook",
      nombre: "Facebook",
      href: "https://www.facebook.com/share/1DtvbEn5t8/?mibextid=wwXIfr",
      color: "text-blue-400",
      icono: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
          <path d="M13.5 21v-8.2h2.77l.41-3.2H13.5V7.56c0-.93.26-1.56 1.6-1.56h1.72V3.15A22.5 22.5 0 0 0 14.3 3c-2.5 0-4.2 1.52-4.2 4.33V9.6H7.3v3.2h2.8V21h3.4z"/>
        </svg>
      )
    }
  ]

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
          <div className="relative z-50 shrink-0">
            <button
              type="button"
              onClick={() => setMostrarRedes((prev) => !prev)}
              title="Redes sociales"
              aria-label="Redes sociales"
              className="shrink-0 flex items-center justify-center px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/30 to-white/15 hover:from-orange-500/45 hover:to-white/25 border border-orange-200/70 ring-1 ring-white/60 shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_0_0_3px_rgba(249,115,22,0.45),0_10px_24px_rgba(249,115,22,0.28)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.65),0_0_0_3px_rgba(249,115,22,0.65),0_12px_28px_rgba(249,115,22,0.4)] active:scale-[0.98] transition-all duration-200"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            {mostrarRedes && (
              <div className="absolute left-0 mt-2 w-48 rounded-xl border border-orange-500/30 bg-gray-900/95 p-2 shadow-xl backdrop-blur-md">
                {redesSociales.map((red) => (
                  <a
                    key={red.id}
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white hover:bg-orange-500/20 transition"
                    onClick={() => setMostrarRedes(false)}
                  >
                    <span className={red.color}>{red.icono}</span>
                    <span>{red.nombre}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleGoHome}
            title="Ir al inicio"
            aria-label="Ir al inicio"
            className="relative z-50 shrink-0 flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500/30 to-white/15 hover:from-orange-500/45 hover:to-white/25 border border-orange-200/70 ring-1 ring-white/60 shadow-[0_0_0_1px_rgba(255,255,255,0.45),0_0_0_3px_rgba(249,115,22,0.45),0_10px_24px_rgba(249,115,22,0.28)] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.65),0_0_0_3px_rgba(249,115,22,0.65),0_12px_28px_rgba(249,115,22,0.4)] active:scale-[0.98] transition-all duration-200 min-w-0 cursor-pointer"
          >
            <img
              src={`${import.meta.env.BASE_URL}logo-petworld.png.jpeg`}
              alt="PetWorld"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white/30 shrink-0"
              onError={(e) => {
                const target = e.currentTarget
                const fallback = `${import.meta.env.BASE_URL}logo-petworld.png.jpeg`

                if (target.dataset.pathFallbackTried !== "true" && target.src !== fallback) {
                  target.dataset.pathFallbackTried = "true"
                  target.src = fallback
                  return
                }

                target.style.display = 'none'
                target.nextSibling.style.display = 'flex'
              }}
            />
            <div className="min-w-0 text-left">
              <span className="block text-lg sm:text-2xl font-bold truncate leading-none">PETWORLD</span>
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