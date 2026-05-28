// src/App.jsx
import { useState, useEffect } from "react"
import { HashRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Footer from "./components/footer"
import Home from "./pages/Home"
import Carrito from "./components/Carrito"
import LoginPage from "./pages/LoginPage"
import RegistroPage from "./pages/RegistroPage"
import SplashScreen from "./components/SplashScreen"
import MetodoPago from "./components/MetodoPago"
import WelcomePage from "./components/WelcomePage"
import PromoStrip from "./components/PromoStrip"
import { enviarPedidoPorWhatsApp } from "./services/whatsappService"

function AppContent() {
  const location = useLocation()
  const navigate = useNavigate()
  const { usuario, agregarCompra } = useAuth() // 👈 Importamos agregarCompra
  const esRutaPrincipal = location.pathname === "/"
  
  const [carrito, setCarrito] = useState(() => {
    const data = localStorage.getItem("carrito")
    if (!data) return []
    const parsed = JSON.parse(data)
    return parsed.map(item => ({ ...item, cantidad: item.cantidad || 1 }))
  })

  const [mostrarCarrito, setMostrarCarrito] = useState(false)
  const [mostrarMetodoPago, setMostrarMetodoPago] = useState(false)
  const [notificacion, setNotificacion] = useState(null)
  const [mostrarSplash, setMostrarSplash] = useState(() => esRutaPrincipal)
  const [mostrarWelcome, setMostrarWelcome] = useState(() => esRutaPrincipal)
  const [procesando, setProcesando] = useState(false)
  const [mostrarModalExito, setMostrarModalExito] = useState(false)

  const handleSplashComplete = () => {
    setMostrarSplash(false)
  }

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito))
  }, [carrito])

  useEffect(() => {
    if (mostrarModalExito) {
      const timer = setTimeout(() => {
        setMostrarModalExito(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [mostrarModalExito])

  const mostrarNotificacion = (mensaje, tipo = "success") => {
    setNotificacion({ mensaje, tipo })
    setTimeout(() => setNotificacion(null), 3000)
  }

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(item => item.id === producto.id)
      if (existe) {
        mostrarNotificacion(`+1 ${producto.nombre} 🛒`, "success")
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      } else {
        mostrarNotificacion(`${producto.nombre} agregado ✅`, "success")
        return [...prev, { ...producto, cantidad: 1 }]
      }
    })
  }

  const aumentarCantidad = (id) => {
    setCarrito(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    )
  }

  const disminuirCantidad = (id) => {
    setCarrito(prev =>
      prev
        .map(item =>
          item.id === id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    )
  }

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id))
  }

  // 👇 FUNCIÓN MODIFICADA PARA FINALIZAR COMPRA CON GUARDADO Y WHATSAPP
  const finalizarCompra = async (metodoPagoId) => {
    if (carrito.length === 0) {
      mostrarNotificacion("Tu carrito está vacío ⚠️", "error")
      return
    }
    
    // Verificar si el usuario está autenticado
    if (!usuario) {
      mostrarNotificacion("Inicia sesión para continuar 🔑", "error")
      setMostrarCarrito(false)
      navigate("/login")
      return
    }
    
    // Verificar que el usuario tenga dirección
    if (!usuario.direccion || usuario.direccion === "") {
      mostrarNotificacion("Agrega tu dirección en el perfil 📍", "error")
      setMostrarCarrito(false)
      navigate("/perfil")
      return
    }
    
    // Métodos de pago
    const metodosPago = {
      1: "💵 Efectivo contra entrega",
      2: "🏦 Transferencia bancaria",
      3: "💳 Tarjeta de crédito/débito",
      4: "📱 Pago por WhatsApp"
    }
    
    const metodoPagoTexto = metodosPago[metodoPagoId] || "Efectivo contra entrega"
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
    
    setProcesando(true)
    
    // Guardar pedido en Firebase
    const resultado = await agregarCompra(carrito, total, metodoPagoTexto)
    
    if (resultado.exito) {
      // Preparar datos del pedido para WhatsApp
      const pedidoData = {
        id: resultado.id,
        productos: carrito,
        total: total,
        metodoPago: metodoPagoTexto
      }
      
      // Abrir WhatsApp con enlace wa.me al administrador
      try {
        const whatsappResult = await enviarPedidoPorWhatsApp(pedidoData, usuario)
        
        if (whatsappResult.success) {
          mostrarNotificacion("✅ Compra guardada y WhatsApp abierto", "success")
        } else {
          mostrarNotificacion(`Compra guardada, pero no se pudo abrir WhatsApp: ${whatsappResult.message}`, "error")
        }
      } catch (whatsappError) {
        console.error('Error con WhatsApp:', whatsappError)
        mostrarNotificacion("Compra guardada, abre WhatsApp manualmente", "error")
      }
      
      setMostrarModalExito(true)
      
      // Limpiar carrito
      setCarrito([])
      localStorage.removeItem("carrito")
      setMostrarCarrito(false)
      setMostrarMetodoPago(false)
      navigate("/", { replace: true })
    } else {
      mostrarNotificacion("Error al guardar el pedido ❌", "error")
    }
    
    setProcesando(false)
  }

  // 👇 FUNCIÓN PARA ABRIR MODAL DE MÉTODO DE PAGO
  const abrirMetodoPago = () => {
    if (carrito.length === 0) {
      mostrarNotificacion("Tu carrito está vacío ⚠️", "error")
      return
    }
    
    if (!usuario) {
      mostrarNotificacion("Inicia sesión para continuar 🔑", "error")
      setMostrarCarrito(false)
      navigate("/login")
      return
    }
    
    setMostrarMetodoPago(true)
  }

  if (esRutaPrincipal && mostrarSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  if (esRutaPrincipal && mostrarWelcome) {
    return <WelcomePage onComplete={() => setMostrarWelcome(false)} />
  }

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0500 50%, #0a0a0a 100%)',
        position: 'relative'
      }}
    >
      {/* Efecto glow naranja */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at bottom, rgba(255,69,0,0.4) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      
      {/* Contenido */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar 
          carrito={carrito}
          abrirCarrito={() => setMostrarCarrito(true)}
        />

        {esRutaPrincipal && <PromoStrip />}

        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  agregarAlCarrito={agregarAlCarrito} 
                  carrito={carrito} 
                />
              } 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
      
      {/* Modal del carrito */}
      {mostrarCarrito && (
        <Carrito 
          carrito={carrito}
          eliminarDelCarrito={eliminarDelCarrito}
          finalizarCompra={abrirMetodoPago}
          aumentarCantidad={aumentarCantidad}
          disminuirCantidad={disminuirCantidad}
          cerrarCarrito={() => setMostrarCarrito(false)}
        />
      )}
      
      {/* Modal de método de pago */}
      {mostrarMetodoPago && (
        <MetodoPago
          onSelect={(metodoId) => {
            setMostrarMetodoPago(false)
            finalizarCompra(metodoId)
          }}
          onClose={() => setMostrarMetodoPago(false)}
          procesando={procesando}
        />
      )}
      
      {/* Modal de éxito de compra */}
      {mostrarModalExito && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl text-center animate-bounce">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">¡Éxito!</h2>
            <p className="text-gray-700 text-lg mb-6">La compra se realizó con éxito</p>
            <p className="text-gray-600 text-sm mb-6">Tu pedido fue guardado y se abrio WhatsApp para enviar el mensaje al administrador.</p>
            <button
              onClick={() => {
                setMostrarModalExito(false)
                navigate("/")
              }}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      )}
      
      {/* Notificaciones */}
      {notificacion && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notificacion.tipo === "success" ? "bg-green-500" : 
          notificacion.tipo === "error" ? "bg-red-500" : "bg-blue-500"
        } text-white animate-slide-in`}>
          {notificacion.mensaje}
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  )
}

export default App