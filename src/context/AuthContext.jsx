// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react"
import { 
  loginWithGoogle, 
  logoutFromGoogle, 
  onAuthChange,
  obtenerUsuarioPorId,
  guardarPedido,
  obtenerPedidosPorUsuario,
  registrarUsuario,
  loginConEmail,
  resolverLoginRedirectGoogle
} from "../firebase/config"

const AuthContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider")
  }
  return context
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [historialCompras, setHistorialCompras] = useState([])
  const [listaDeseos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true
    let unsubscribe = () => {}

    const sincronizarUsuario = async (firebaseUser) => {
      if (!activo) return

      setCargando(true)
      
      if (firebaseUser) {
        const perfilResult = await obtenerUsuarioPorId(firebaseUser.uid)
        const perfil = perfilResult.exito ? perfilResult.usuario : {}

        const usuarioData = {
          id: firebaseUser.uid,
          nombre: perfil?.nombre || firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Usuario",
          email: perfil?.email || firebaseUser.email || "",
          foto: perfil?.foto || firebaseUser.photoURL || "",
          telefono: perfil?.telefono || firebaseUser.phoneNumber || "",
          direccion: perfil?.direccion || "",
          ciudad: perfil?.ciudad || "",
          fechaRegistro: perfil?.fechaRegistro || firebaseUser.metadata.creationTime,
          authProvider: firebaseUser.providerData?.[0]?.providerId === "google.com" ? "google" : "email"
        }
        setUsuario(usuarioData)

        const pedidosResult = await obtenerPedidosPorUsuario(firebaseUser.uid)
        if (pedidosResult.exito && activo) {
          setHistorialCompras(pedidosResult.pedidos)
        }
      } else {
        setUsuario(null)
        setHistorialCompras([])
      }
      
      if (activo) {
        setCargando(false)
      }
    }

    const inicializarAuth = async () => {
      await resolverLoginRedirectGoogle()
      if (!activo) return
      unsubscribe = onAuthChange(sincronizarUsuario)
    }

    inicializarAuth()

    return () => {
      activo = false
      unsubscribe()
    }
  }, [])

  const loginConGoogle = async () => {
    const resultado = await loginWithGoogle()
    return resultado
  }

  const login = async (email, password) => {
    const resultado = await loginConEmail(email, password)
    return resultado
  }

  const registrar = async (nombre, email, password, telefono) => {
    const resultado = await registrarUsuario(nombre, email, password, telefono)
    return resultado
  }

  const logout = async () => {
    await logoutFromGoogle()
    setUsuario(null)
    setHistorialCompras([])

    // Limpiar solo datos no sensibles de UI
    localStorage.removeItem("carrito")
  }

  const actualizarPerfil = async (datos) => {
    if (!usuario) return { exito: false }
    const usuarioActualizado = { ...usuario, ...datos }
    setUsuario(usuarioActualizado)

    return { exito: true }
  }

  const agregarCompra = async (carrito, total, metodoPago = "Efectivo") => {
    if (!usuario) {
      return { exito: false, mensaje: "Inicia sesión para comprar" }
    }
    
    const pedido = {
      usuarioId: usuario.id,
      usuarioNombre: usuario.nombre,
      usuarioEmail: usuario.email,
      usuarioTelefono: usuario.telefono,
      usuarioDireccion: usuario.direccion,
      usuarioCiudad: usuario.ciudad,
      productos: carrito.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad,
        subtotal: item.precio * item.cantidad
      })),
      total: total,
      metodoPago: metodoPago
    }
    
    const resultado = await guardarPedido(pedido)
    
    if (resultado.exito) {
      const nuevoPedido = {
        id: resultado.id,
        ...pedido,
        fecha: new Date().toISOString(),
        estado: "pendiente"
      }
      setHistorialCompras([nuevoPedido, ...historialCompras])
    }
    
    return resultado
  }

  return (
    <AuthContext.Provider value={{
      usuario,
      historialCompras,
      listaDeseos,
      cargando,
      login,
      loginConGoogle,
      logout,
      registrar,
      actualizarPerfil,
      agregarCompra,
      estaAutenticado: !!usuario
    }}>
      {children}
    </AuthContext.Provider>
  )
}