// src/components/Footer.jsx
import { useNavigate } from "react-router-dom"

function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* Contenido principal del footer */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1 - Logo y descripción */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <img 
                src={`${import.meta.env.BASE_URL}logo-petworld.png.jpeg`}
                alt="PetWorld"
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.innerHTML = '<span class="text-3xl">🐾</span>'
                }}
              />
              <span className="text-xl font-bold">PetWorld</span>
            </div>
            <p className="text-gray-400 text-sm">
              Cuidando a tu mejor amigo con productos veterinarios de calidad.
            </p>
            <div className="flex gap-3 justify-center md:justify-start mt-4">
              <a
                href="https://wa.me/50499288926"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
                className="text-gray-400 hover:text-green-400 transition"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07.02C5.54.02.22 5.35.22 11.88c0 2.1.55 4.15 1.6 5.96L.03 24l6.32-1.66a11.8 11.8 0 0 0 5.72 1.46h.01c6.53 0 11.85-5.33 11.85-11.86 0-3.17-1.24-6.15-3.41-8.46zM12.08 21.8h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.75.99 1-3.66-.23-.38a9.8 9.8 0 0 1-1.5-5.29c0-5.42 4.41-9.84 9.85-9.84 2.63 0 5.1 1.03 6.96 2.9a9.78 9.78 0 0 1 2.87 6.95c0 5.43-4.42 9.85-9.86 9.85zm5.4-7.38c-.3-.15-1.77-.87-2.04-.96-.27-.1-.47-.15-.67.15-.2.29-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.48a8.95 8.95 0 0 1-1.66-2.07c-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.48s1.08 2.88 1.23 3.08c.15.2 2.12 3.24 5.13 4.54.72.3 1.28.48 1.72.62.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/petworld.hn?igsh=MXFjczBuaHd1ODB5MA=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram"
                className="text-gray-400 hover:text-pink-400 transition"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.9 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1DtvbEn5t8/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-8.2h2.77l.41-3.2H13.5V7.56c0-.93.26-1.56 1.6-1.56h1.72V3.15A22.5 22.5 0 0 0 14.3 3c-2.5 0-4.2 1.52-4.2 4.33V9.6H7.3v3.2h2.8V21h3.4z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button onClick={() => navigate("/")} className="hover:text-white transition">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/productos")} className="hover:text-white transition">
                  Productos
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/ofertas")} className="hover:text-white transition">
                  Ofertas
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/contacto")} className="hover:text-white transition">
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Horario */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-4">Horario</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Lunes a sábado</li>
              <li>8:00 AM - 6:00 PM</li>
              <li>Atención en tienda y consultas</li>
              <li>Respuesta por WhatsApp dentro del horario</li>
            </ul>
          </div>

          {/* Columna 4 - Contacto */}
          <div className="text-center md:text-left">
            <h3 className="font-bold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Tegucigalpa, Honduras</li>
              <li>
                <a
                  href="https://wa.me/50499288926"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.07.02C5.54.02.22 5.35.22 11.88c0 2.1.55 4.15 1.6 5.96L.03 24l6.32-1.66a11.8 11.8 0 0 0 5.72 1.46h.01c6.53 0 11.85-5.33 11.85-11.86 0-3.17-1.24-6.15-3.41-8.46zM12.08 21.8h-.01a9.85 9.85 0 0 1-5.02-1.37l-.36-.21-3.75.99 1-3.66-.23-.38a9.8 9.8 0 0 1-1.5-5.29c0-5.42 4.41-9.84 9.85-9.84 2.63 0 5.1 1.03 6.96 2.9a9.78 9.78 0 0 1 2.87 6.95c0 5.43-4.42 9.85-9.86 9.85zm5.4-7.38c-.3-.15-1.77-.87-2.04-.96-.27-.1-.47-.15-.67.15-.2.29-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.48a8.95 8.95 0 0 1-1.66-2.07c-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.57-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.48s1.08 2.88 1.23 3.08c.15.2 2.12 3.24 5.13 4.54.72.3 1.28.48 1.72.62.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"/>
                  </svg>
                  <span>+504 9928-8926</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/petworld.hn?igsh=MXFjczBuaHd1ODB5MA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.9 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65z"/>
                  </svg>
                  <span>petworld.hn</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1DtvbEn5t8/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M13.5 21v-8.2h2.77l.41-3.2H13.5V7.56c0-.93.26-1.56 1.6-1.56h1.72V3.15A22.5 22.5 0 0 0 14.3 3c-2.5 0-4.2 1.52-4.2 4.33V9.6H7.3v3.2h2.8V21h3.4z"/>
                  </svg>
                  <span>PetWorld en Facebook</span>
                </a>
              </li>
              <li>Lun-Vie: 8am - 6pm</li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 PetWorld - Todos los derechos reservados
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <button className="hover:text-white transition">Términos y condiciones</button>
              <button className="hover:text-white transition">Política de privacidad</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer