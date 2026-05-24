// src/components/Carrito.jsx
import { useState } from "react"

function Carrito({ 
  carrito = [], 
  eliminarDelCarrito, 
  finalizarCompra,
  aumentarCantidad,
  disminuirCantidad,
  cerrarCarrito
}) {

  const [enviando, setEnviando] = useState(false)

  const total = carrito?.reduce(
    (acc, item) => acc + (item.precio || 0) * (item.cantidad || 0),
    0
  )

  const handleFinalizarCompra = () => {
    setEnviando(true)
    // Pequeña pausa para mostrar el estado de carga
    setTimeout(() => {
      finalizarCompra()
      setEnviando(false)
    }, 500)
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in" 
      onClick={cerrarCarrito}
    >
      <div 
        className="bg-gray-900 w-full h-full sm:w-[450px] sm:h-auto sm:max-h-[85vh] overflow-auto rounded-none sm:rounded-2xl shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header con gradiente */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 p-4 sm:p-5 pt-[calc(env(safe-area-inset-top)+12px)] rounded-none sm:rounded-t-2xl border-b border-white/10 z-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              🛒 Mi carrito
              {carrito.length > 0 && (
                <span className="text-sm bg-orange-500 text-white px-2 py-0.5 rounded-full">
                  {carrito.length}
                </span>
              )}
            </h2>
            <button 
              onClick={cerrarCarrito}
              aria-label="Cerrar carrito"
              className="text-red-600 hover:text-red-500 text-3xl leading-none font-bold transition p-2 -m-2"
            >
              ×
            </button>
          </div>
        </div>

        {/* Lista de productos */}
        {carrito.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-400">Tu carrito está vacío</p>
            <p className="text-gray-500 text-sm mt-2">¡Agrega productos para comenzar!</p>
            <button
              onClick={cerrarCarrito}
              className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Seguir comprando
            </button>
          </div>
        ) : (
          <>
            {/* Lista de items */}
            <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
              {carrito.map(item => (
                <div 
                  key={item.id}
                  className="bg-gray-800/50 rounded-xl p-3 border border-white/5 hover:border-orange-500/30 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{item.nombre}</h3>
                      <p className="text-orange-400 text-sm mt-1">
                        L {item.precio} c/u
                      </p>
                    </div>
                    <button 
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-gray-500 hover:text-red-500 transition text-sm"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button 
                        onClick={() => disminuirCantidad(item.id)}
                        className="bg-gray-700 hover:bg-gray-600 text-white w-9 h-9 rounded-lg transition"
                      >
                        ➖
                      </button>
                      <span className="font-bold text-white min-w-[30px] text-center">
                        {item.cantidad}
                      </span>
                      <button 
                        onClick={() => aumentarCantidad(item.id)}
                        className="bg-gray-700 hover:bg-gray-600 text-white w-9 h-9 rounded-lg transition"
                      >
                        ➕
                      </button>
                    </div>
                    <p className="font-bold text-white">
                      L {item.precio * item.cantidad}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen y total */}
            <div className="border-t border-white/10 p-4 sm:p-5 bg-gray-800/30 pb-8 sm:pb-5">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>L {total}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Envío</span>
                  <span>Por calcular</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-orange-400">L {total}</span>
                </div>
              </div>

              <button
                onClick={handleFinalizarCompra}
                disabled={enviando}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  enviando 
                    ? "bg-gray-600 cursor-not-allowed" 
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg"
                } text-white`}
              >
                {enviando ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    🧾 Finalizar compra
                  </>
                )}
              </button>

              <button
                onClick={cerrarCarrito}
                className="w-full mt-3 py-2 rounded-xl text-red-500 hover:text-red-400 transition text-sm font-semibold"
              >
                ← Seguir comprando
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Carrito