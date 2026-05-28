// src/components/Perfil.jsx (agrega la foto de perfil)
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import HistorialCompras from "./HistorialCompras"
import UserAvatar from "./UserAvatar"

function Perfil({ onClose, enfoqueInicial = null }) {
  const { usuario, logout, actualizarPerfil, historialCompras } = useAuth()
  const [modoEdicion, setModoEdicion] = useState(false)
  const [nombre, setNombre] = useState(usuario?.nombre || "")
  const [telefono, setTelefono] = useState(usuario?.telefono || "")
  const [direccion, setDireccion] = useState(usuario?.direccion || "")
  const [mensaje, setMensaje] = useState("")
  const [mostrarHistorial, setMostrarHistorial] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const direccionRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (enfoqueInicial !== "direccion") return

    setModoEdicion(true)

    const timer = setTimeout(() => {
      direccionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      direccionRef.current?.focus()
    }, 100)

    return () => clearTimeout(timer)
  }, [enfoqueInicial])

  const handleGuardar = async () => {
    if (guardando) return

    setGuardando(true)
    const resultado = await actualizarPerfil({ nombre, telefono, direccion })
    if (resultado.exito) {
      setMensaje("Perfil actualizado correctamente")
      setModoEdicion(false)
      setTimeout(() => {
        setMensaje("")
        onClose()
        navigate("/")
      }, 1500)
    } else {
      setMensaje(resultado.mensaje || "No se pudo actualizar el perfil")
    }

    setGuardando(false)
  }

  const handleCerrarSesion = async () => {
    await logout()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">👤 Mi Perfil</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>
        
        {mensaje && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
            {mensaje}
          </div>
        )}
        
        {/* Foto de perfil (solo para usuarios de Google) */}
        <div className="flex justify-center mb-6">
          <UserAvatar
            usuario={usuario}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
          />
        </div>
        
        {/* Información del usuario */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Información personal</h3>
            {!modoEdicion && usuario?.authProvider !== "google" && (
              <button
                onClick={() => setModoEdicion(true)}
                className="text-blue-500 hover:text-blue-600"
              >
                ✏️ Editar
              </button>
            )}
            {usuario?.authProvider === "google" && (
              <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                Cuenta de Google
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-gray-600 text-sm">Nombre</label>
              {modoEdicion ? (
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              ) : (
                <p className="text-gray-800">{usuario?.nombre}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm">Email</label>
              <p className="text-gray-800">{usuario?.email}</p>
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm">Teléfono</label>
              {modoEdicion ? (
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="No especificado"
                />
              ) : (
                <p className="text-gray-800">{usuario?.telefono || "No especificado"}</p>
              )}
            </div>
            
            <div>
              <div className="flex items-center justify-between gap-3">
                <label className="block text-gray-600 text-sm">Dirección</label>
                {!modoEdicion && (
                  <button
                    onClick={() => setModoEdicion(true)}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    ✏️ Editar dirección
                  </button>
                )}
              </div>
              {modoEdicion ? (
                <textarea
                  ref={direccionRef}
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  rows="2"
                  placeholder="No especificada"
                />
              ) : (
                <p className="text-gray-800">{usuario?.direccion || "No especificada"}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-600 text-sm">Miembro desde</label>
              <p className="text-gray-800">
                {new Date(usuario?.fechaRegistro).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {modoEdicion && (
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                onClick={() => {
                  setModoEdicion(false)
                  setNombre(usuario?.nombre)
                  setTelefono(usuario?.telefono)
                  setDireccion(usuario?.direccion)
                }}
                disabled={guardando}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
        
        {/* Historial de compras */}
        <div className="mt-8 pt-6 border-t">
          <button
            onClick={() => setMostrarHistorial(!mostrarHistorial)}
            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
          >
            📦 {mostrarHistorial ? "Ocultar" : "Ver"} historial de compras
            <span>{mostrarHistorial ? "▲" : "▼"}</span>
          </button>
          
          {mostrarHistorial && (
            <div className="mt-4">
              <HistorialCompras compras={historialCompras} />
            </div>
          )}
        </div>
        
        {/* Botón cerrar sesión */}
        <div className="mt-8 pt-6 border-t">
          <button
            onClick={handleCerrarSesion}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
          >
            Cerrar sesión 🚪
          </button>
        </div>
      </div>
    </div>
  )
}

export default Perfil