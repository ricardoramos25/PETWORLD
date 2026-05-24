// src/components/Registro.jsx
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { validateRegisterInput } from "../services/authSecurity"

function Registro({ onClose, onCambiarALogin }) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [telefono, setTelefono] = useState("")
  const [error, setError] = useState("")
  const { registrar } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const validation = validateRegisterInput({
      nombre,
      email,
      password,
      confirmPassword,
      telefono
    })

    if (!validation.valid) {
      setError(validation.message)
      return
    }

    const resultado = await registrar(
      validation.nombre,
      validation.email,
      validation.password,
      validation.telefono
    )
    
    if (resultado.exito) {
      onClose()
    } else {
      setError(resultado.mensaje)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-md shadow-2xl max-h-[92vh] overflow-y-auto my-2 sm:my-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Crear Cuenta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Teléfono (opcional)</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
          >
            Registrarse
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={onCambiarALogin}
            className="text-blue-500 hover:underline"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  )
}

export default Registro