// src/components/HistorialCompras.jsx
function HistorialCompras({ compras }) {
  
  if (compras.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <div className="text-4xl mb-2">🛒</div>
        <p className="text-gray-500">No has realizado ninguna compra aún</p>
        <p className="text-gray-400 text-sm">¡Explora nuestros productos y haz tu primera compra!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Mis compras</h3>
      
      {compras.map(compra => (
        <div key={compra.id} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-sm text-gray-500">
                📅 {new Date(compra.fecha).toLocaleDateString()} - {new Date(compra.fecha).toLocaleTimeString()}
              </p>
              <p className="text-sm font-medium text-green-600">Estado: {compra.estado}</p>
            </div>
            <p className="font-bold text-lg">L {compra.total}</p>
          </div>
          
          <div className="space-y-2">
            {compra.productos.map(producto => (
              <div key={producto.id} className="flex justify-between text-sm">
                <span>
                  {producto.cantidad}x {producto.nombre}
                </span>
                <span>L {producto.precio * producto.cantidad}</span>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-gray-400 mt-2">ID de pedido: #{compra.id}</p>
        </div>
      ))}
    </div>
  )
}

export default HistorialCompras