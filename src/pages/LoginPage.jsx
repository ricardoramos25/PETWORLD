// src/pages/LoginPage.jsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  clearFailedLoginAttempts,
  getLockTimeSeconds,
  getLoginLockInfo,
  getRemainingAttempts,
  registerFailedLoginAttempt,
  validateLoginInput
} from "../services/authSecurity"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [cargando, setCargando] = useState(false)
  const [cargandoGoogle, setCargandoGoogle] = useState(false)
  const { login, loginConGoogle, estaAutenticado } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (estaAutenticado) {
      navigate("/", { replace: true })
    }
  }, [estaAutenticado, navigate])

  const esErrorConfiguracionFirebase = (resultado) => {
    const codigo = resultado?.codigo || ""
    const mensaje = (resultado?.mensaje || "").toLowerCase()

    return (
      codigo === "auth/unauthorized-domain" ||
      codigo === "auth/operation-not-allowed" ||
      codigo === "auth/invalid-api-key" ||
      codigo === "auth/app-not-authorized" ||
      mensaje.includes("dominio no autorizado") ||
      mensaje.includes("api key") ||
      mensaje.includes("no esta autorizada")
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateLoginInput(email, password)
    if (!validation.valid) {
      alert(validation.message)
      return
    }

    const lockInfo = getLoginLockInfo()
    if (lockInfo.isLocked) {
      const remainingSeconds = Math.ceil(lockInfo.remainingMs / 1000)
      alert(`Demasiados intentos. Espera ${remainingSeconds}s e intenta nuevamente.`)
      return
    }

    setCargando(true)

    const resultado = await login(validation.email, validation.password)
    if (resultado.exito) {
      clearFailedLoginAttempts()
      navigate("/")
    } else {
      if (esErrorConfiguracionFirebase(resultado)) {
        alert(resultado.mensaje || "Error de configuracion de Firebase")
        setCargando(false)
        return
      }

      const state = registerFailedLoginAttempt()
      if (state.isLocked) {
        alert(`Demasiados intentos. Bloqueado por ${getLockTimeSeconds()}s.`)
      } else {
        const remaining = getRemainingAttempts()
        alert(`${resultado.mensaje || "Error al iniciar sesion"} Intentos restantes: ${remaining}.`)
      }
    }

    setCargando(false)
  }

  const handleGoogleLogin = async () => {
    const lockInfo = getLoginLockInfo()
    if (lockInfo.isLocked) {
      const remainingSeconds = Math.ceil(lockInfo.remainingMs / 1000)
      alert(`Demasiados intentos. Espera ${remainingSeconds}s e intenta nuevamente.`)
      return
    }

    setCargandoGoogle(true)
    try {
      const resultado = await loginConGoogle()
      console.log('[LoginPage] resultado loginConGoogle:', resultado)
      if (resultado.exito) {
        clearFailedLoginAttempts()

        if (resultado.redireccion) {
          // Cambiará de página sola al volver del redirect
          setCargandoGoogle(false)
          return
        }

        navigate("/")
      } else {
        const codigoError = resultado?.codigo || "sin-codigo"
        const mensajeError = resultado?.mensaje || "Error desconocido"
        alert(`Error Google [${codigoError}]: ${mensajeError}`)
        setCargandoGoogle(false)
      }
    } catch (err) {
      alert(`Excepción Google: ${err?.code || "sin-codigo"} - ${err?.message || err}`)
    }
    setCargandoGoogle(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full my-3 sm:my-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 p-4 sm:p-6 text-center">
          <div className="text-4xl sm:text-5xl mb-2">🐾</div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">PetWorld</h1>
          <p className="text-blue-100 mt-1 text-sm sm:text-base">Tu tienda de confianza para mascotas</p>
        </div>

        {/* Formulario */}
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-5 sm:mb-6 text-gray-800">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu contraseña"
                required
              />
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {cargando ? "Iniciando..." : "Iniciar Sesión"}
            </button>
          </form>

          {/* Separador */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O</span>
              </div>
            </div>
          </div>

          {/* Botón de Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={cargandoGoogle}
            className="w-full min-h-11 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-sm sm:text-base"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {cargandoGoogle ? "Conectando..." : "Continuar con Google"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => navigate("/registro")}
                className="inline-block mt-1 sm:mt-0 text-blue-600 hover:text-blue-800 font-semibold text-base"
              >
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage