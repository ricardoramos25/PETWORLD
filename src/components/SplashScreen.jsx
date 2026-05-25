// src/components/SplashScreen.jsx
import { useEffect, useState } from 'react'

function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo */}
        <div className="mb-8 animate-bounce">
          <img
            src={`${import.meta.env.BASE_URL}logo-petworld.png.jpeg`}
            alt="PetWorld Logo"
            className="w-20 h-20 mx-auto mb-4 rounded-full object-cover border-4 border-white/50"
            onError={(e) => {
              const target = e.currentTarget
              const fallback = `${import.meta.env.BASE_URL}public/logo-petworld.png.jpeg`

              if (target.dataset.pathFallbackTried !== "true" && target.src !== fallback) {
                target.dataset.pathFallbackTried = "true"
                target.src = fallback
                return
              }

              target.style.display = 'none'
              target.parentElement.innerHTML = '<div class="text-6xl mb-4">🐾</div>'
            }}
          />
          <h1 className="text-4xl font-bold text-white mb-2">PetWorld</h1>
          <p className="text-blue-100">Tu tienda veterinaria online</p>
        </div>

        {/* Barra de progreso */}
        <div className="w-64 bg-white/20 rounded-full h-2 mb-4">
          <div
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-white/80 text-sm">Cargando... {progress}%</p>
      </div>
    </div>
  )
}

export default SplashScreen