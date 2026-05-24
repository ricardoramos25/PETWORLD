// src/components/Login.jsx
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import {
  clearFailedLoginAttempts,
  getLockTimeSeconds,
  getLoginLockInfo,
  getRemainingAttempts,
  registerFailedLoginAttempt,
  validateLoginInput
} from "../services/authSecurity"

function Login({ onClose, onCambiarARegistro }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)
  const { login, loginConGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const validation = validateLoginInput(email, password)
    if (!validation.valid) {
      setError(validation.message)
      return
    }

    const lockInfo = getLoginLockInfo()
    if (lockInfo.isLocked) {
      const remainingSeconds = Math.ceil(lockInfo.remainingMs / 1000)
      setError(`Demasiados intentos. Espera ${remainingSeconds}s e intenta nuevamente.`)
      return
    }

    setCargando(true)

    const resultado = await login(validation.email, validation.password)
    
    if (resultado.exito) {
      clearFailedLoginAttempts()
      onClose()
    } else {
      const state = registerFailedLoginAttempt()
      if (state.isLocked) {
        setError(`Demasiados intentos. Bloqueado por ${getLockTimeSeconds()}s.`)
      } else {
        const remaining = getRemainingAttempts()
        setError(`${resultado.mensaje} Intentos restantes: ${remaining}.`)
      }
    }
    setCargando(false)
  }

  const handleGoogleLogin = async () => {
    setError("")

    const lockInfo = getLoginLockInfo()
    if (lockInfo.isLocked) {
      const remainingSeconds = Math.ceil(lockInfo.remainingMs / 1000)
      setError(`Demasiados intentos. Espera ${remainingSeconds}s e intenta nuevamente.`)
      return
    }

    setCargando(true)
    
    const resultado = await loginConGoogle()
    
    if (resultado.exito) {
      clearFailedLoginAttempts()

      // En flujo redirect, la autenticación finaliza cuando Google retorna al sitio.
      if (resultado.redireccion) {
        setCargando(false)
        return
      }

      onClose()
    } else {
      const state = registerFailedLoginAttempt()
      if (state.isLocked) {
        setError(`Demasiados intentos. Bloqueado por ${getLockTimeSeconds()}s.`)
      } else {
        const remaining = getRemainingAttempts()
        setError(`${resultado.mensaje || "Error al iniciar con Google"} Intentos restantes: ${remaining}.`)
      }
    }
    setCargando(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-4 sm:p-8 w-full max-w-md shadow-2xl max-h-[92vh] overflow-y-auto my-2 sm:my-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Iniciar Sesión</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Botón de Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={cargando}
          className="w-full mb-4 min-h-11 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-medium text-sm sm:text-base"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5"
          />
          Continuar con Google
        </button>
        
        {/* Separador */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O continúa con email</span>
          </div>
        </div>
        
        {/* Formulario email/password */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={cargando}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={cargando}
            />
          </div>
          
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {cargando ? "Cargando..." : "Ingresar"}
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-600">
          ¿No tienes cuenta?{" "}
          <button
            onClick={onCambiarARegistro}
            className="text-blue-500 hover:underline"
            disabled={cargando}
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login