// src/components/MetodoPago.jsx
import { useState } from 'react'

function MetodoPago({ onSelect, onClose, procesando }) {
  const [seleccionado, setSeleccionado] = useState(null)

  const metodos = [
    { id: 1, nombre: "💵 Efectivo contra entrega", descripcion: "Paga al recibir tu pedido", icono: "💵" },
    { id: 2, nombre: "🏦 Transferencia bancaria", descripcion: "BAC, Ficohsa, Atlántida", icono: "🏦" },
    { id: 3, nombre: "💳 Tarjeta de crédito/débito", descripcion: "Visa, Mastercard", icono: "💳" },
    { id: 4, nombre: "📱 Pago por WhatsApp", descripcion: "Te contactaremos para coordinar", icono: "📱" }
  ]

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">💳 Método de pago</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            disabled={procesando}
          >
            ✖
          </button>
        </div>
        
        <p className="text-gray-500 text-sm mb-4">
          Selecciona cómo deseas pagar tu pedido
        </p>
        
        <div className="space-y-3 mb-6">
          {metodos.map(metodo => (
            <label
              key={metodo.id}
              className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                seleccionado === metodo.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300"
              }`}
            >
              <input
                type="radio"
                name="metodoPago"
                value={metodo.id}
                checked={seleccionado === metodo.id}
                onChange={() => setSeleccionado(metodo.id)}
                className="mt-1 mr-3 w-4 h-4 text-orange-500"
                disabled={procesando}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{metodo.icono}</span>
                  <p className="font-semibold text-gray-800">{metodo.nombre}</p>
                </div>
                <p className="text-sm text-gray-500 ml-8">{metodo.descripcion}</p>
              </div>
            </label>
          ))}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition font-medium"
            disabled={procesando}
          >
            Cancelar
          </button>
          <button
            onClick={() => seleccionado && onSelect(seleccionado)}
            disabled={!seleccionado || procesando}
            className="flex-1 bg-orange-500 text-white py-3 rounded-xl hover:bg-orange-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {procesando ? "Procesando..." : "Confirmar pedido"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MetodoPago