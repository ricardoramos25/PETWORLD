// src/components/Toast.jsx
import { useEffect } from "react"

function Toast({ mensaje, tipo = "success", onClose }) {
  
  // Efecto para cerrar automáticamente después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose() // Llama a la función para cerrar
    }, 3000) // 3000 milisegundos = 3 segundos

    // Limpiar el temporizador si el componente se desmonta antes
    return () => clearTimeout(timer)
  }, [onClose])

  // Definir colores según el tipo de notificación
  const colores = {
    success: "bg-green-500",  // Verde para éxito
    error: "bg-red-500",      // Rojo para error
    info: "bg-blue-500"       // Azul para información
  }

  // Iconos según el tipo
  const iconos = {
    success: "✅",
    error: "❌",
    info: "ℹ️"
  }

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 
        ${colores[tipo]} 
        text-white 
        rounded-lg 
        shadow-lg 
        p-4 
        flex 
        items-center 
        gap-3 
        min-w-[280px]
        animate-slide-in
      `}
    >
      {/* Icono */}
      <span className="text-xl">{iconos[tipo]}</span>
      
      {/* Mensaje */}
      <span className="flex-1">{mensaje}</span>
      
      {/* Botón para cerrar manualmente */}
      <button 
        onClick={onClose}
        className="ml-2 text-white hover:text-gray-200 transition"
      >
        ✖
      </button>
    </div>
  )
}

export default Toast