// src/components/AnimationDemo.jsx
import { useState } from 'react'
import SplashScreen from './SplashScreen'

function AnimationDemo() {
  const [showAnimation, setShowAnimation] = useState(true)

  const handleAnimationComplete = () => {
    setShowAnimation(false)
  }

  const restartAnimation = () => {
    setShowAnimation(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      {!showAnimation && (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🎬 Animación Completada</h1>
          <p className="text-gray-600 mb-8">La animación del SplashScreen ha terminado</p>
          <button
            onClick={restartAnimation}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🔄 Ver animación nuevamente
          </button>
        </div>
      )}

      {showAnimation && (
        <SplashScreen onComplete={handleAnimationComplete} />
      )}
    </div>
  )
}

export default AnimationDemo