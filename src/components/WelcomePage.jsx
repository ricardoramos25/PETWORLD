import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function WelcomePage({ onComplete }) {
  const canvasRef = useRef(null)
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    let width, height
    let particles = []
    let mouseX = null
    let mouseY = null
    let mouseRadius = 200

    // Configuración de partículas - Colores naranja y negro
    const PARTICLE_COUNT = 200
    const PARTICLE_SIZE = 4
    const CONNECTION_DISTANCE = 150
    const MOUSE_FORCE = 0.08

    class Particle {
      constructor(x, y) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * 0.8
        this.vy = (Math.random() - 0.5) * 0.8
        this.size = Math.random() * PARTICLE_SIZE + 1
        // Colores: naranja, naranja claro, gris oscuro
        const colors = ['#ff6600', '#ff8533', '#ffaa33', '#333333', '#555555']
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.originalColor = this.color
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)

        // Efecto de brillo para naranja
        if (this.color === '#ff6600' || this.color === '#ff8533') {
          ctx.shadowBlur = 15
          ctx.shadowColor = '#ff6600'
        } else {
          ctx.shadowBlur = 5
          ctx.shadowColor = '#ff6600'
        }

        ctx.fillStyle = this.color
        ctx.fill()
        ctx.shadowBlur = 0
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        // Interacción con el mouse
        if (mouseX !== null && mouseY !== null) {
          const dx = this.x - mouseX
          const dy = this.y - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouseRadius) {
            const angle = Math.atan2(dy, dx)
            const force = (mouseRadius - distance) / mouseRadius
            this.vx += Math.cos(angle) * force * MOUSE_FORCE
            this.vy += Math.sin(angle) * force * MOUSE_FORCE

            // Cambiar color temporalmente al interactuar
            if (this.color !== '#ff6600') {
              this.color = '#ff9933'
              setTimeout(() => {
                this.color = this.originalColor
              }, 200)
            }
          }
        }

        // Límites con rebote suave
        if (this.x < 0 || this.x > width) {
          this.vx *= -0.9
          this.x = Math.max(0, Math.min(width, this.x))
        }
        if (this.y < 0 || this.y > height) {
          this.vy *= -0.9
          this.y = Math.max(0, Math.min(height, this.y))
        }

        this.vx *= 0.99
        this.vy *= 0.99

        this.draw()
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < CONNECTION_DISTANCE) {
            const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)

            // Gradiente naranja para las líneas
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
            gradient.addColorStop(0, `rgba(255, 102, 0, ${opacity})`)
            gradient.addColorStop(1, `rgba(255, 153, 51, ${opacity})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.5
            ctx.stroke()
          }
        }
      }
    }

    function drawMouseGlow() {
      if (mouseX !== null && mouseY !== null) {
        const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, mouseRadius)
        gradient.addColorStop(0, 'rgba(255, 102, 0, 0.15)')
        gradient.addColorStop(0.5, 'rgba(255, 102, 0, 0.05)')
        gradient.addColorStop(1, 'rgba(255, 102, 0, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }
    }

    function drawParticleExplosion(x, y) {
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 8 + 3
        const particle = new Particle(x, y)
        particle.vx = Math.cos(angle) * speed
        particle.vy = Math.sin(angle) * speed
        particle.size = Math.random() * 5 + 2
        particle.color = ['#ff6600', '#ff8533', '#ffaa33'][Math.floor(Math.random() * 3)]
        particles.push(particle)

        setTimeout(() => {
          const index = particles.indexOf(particle)
          if (index > -1) particles.splice(index, 1)
        }, 2000)
      }
    }

    function initParticles() {
      particles = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(
          Math.random() * width,
          Math.random() * height
        ))
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height)

      // Dibujar fondo negro con gradiente
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, '#0a0a0a')
      gradient.addColorStop(1, '#000000')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      particles.forEach(particle => particle.update())
      drawConnections()
      drawMouseGlow()

      requestAnimationFrame(animate)
    }

    function resizeCanvas() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initParticles()
    }

    function handleMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function handleMouseLeave() {
      mouseX = null
      mouseY = null
    }

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    canvas.addEventListener('click', (e) => {
      drawParticleExplosion(e.clientX, e.clientY)
    })

    resizeCanvas()
    animate()

    // Efecto de partículas siguiendo al mouse
    let mouseTrail = []
    setInterval(() => {
      if (mouseX !== null && mouseY !== null) {
        const trailParticle = new Particle(mouseX, mouseY)
        trailParticle.size = 2
        trailParticle.color = '#ff6600'
        particles.push(trailParticle)

        setTimeout(() => {
          const index = particles.indexOf(trailParticle)
          if (index > -1) particles.splice(index, 1)
        }, 500)
      }
    }, 100)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleExplorar = () => {
    setShowWelcome(false)
    onComplete()
    navigate('/')
  }

  if (!showWelcome) return null

  return (
    <div style={{
      fontFamily: "'Poppins', 'Arial', sans-serif",
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      zIndex: 9999
    }}>
      {/* Canvas de fondo */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)'
        }}
      />

      {/* Patitas decorativas */}
      <div style={{
        position: 'absolute',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 6s infinite ease-in-out',
        pointerEvents: 'none',
        top: '10%',
        left: '5%'
      }}>🐾</div>
      <div style={{
        position: 'absolute',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 6s infinite ease-in-out',
        pointerEvents: 'none',
        top: '20%',
        right: '8%',
        animationDelay: '1s'
      }}>🐾</div>
      <div style={{
        position: 'absolute',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 6s infinite ease-in-out',
        pointerEvents: 'none',
        bottom: '15%',
        left: '10%',
        animationDelay: '2s'
      }}>🐾</div>
      <div style={{
        position: 'absolute',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 6s infinite ease-in-out',
        pointerEvents: 'none',
        bottom: '25%',
        right: '15%',
        animationDelay: '0.5s'
      }}>🐾</div>
      <div style={{
        position: 'absolute',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 6s infinite ease-in-out',
        pointerEvents: 'none',
        top: '50%',
        left: '3%',
        animationDelay: '1.5s'
      }}>🐾</div>
      <div style={{
        position: 'absolute',
        fontSize: '2rem',
        opacity: 0.1,
        animation: 'float 6s infinite ease-in-out',
        pointerEvents: 'none',
        top: '70%',
        right: '5%',
        animationDelay: '2.5s'
      }}>🐾</div>

      {/* Contenido principal */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        color: 'white',
        textAlign: 'center',
        padding: '2rem',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Tarjeta de bienvenida */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '30px',
          padding: '3rem 4rem',
          border: '2px solid #ff6600',
          boxShadow: '0 0 50px rgba(255, 102, 0, 0.3)',
          animation: 'slideIn 0.8s ease-out'
        }}>
          <div style={{
            fontSize: '1.5rem',
            color: '#ff9933',
            marginBottom: '1rem',
            letterSpacing: '2px'
          }}>
            Bienvenido a
          </div>
          <h1 style={{
            fontSize: '5rem',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #ff6600, #ff9933)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 30px rgba(255, 102, 0, 0.5)',
            animation: 'pulse 2s infinite'
          }}>
            PETWORLD
          </h1>
          <div style={{
            fontSize: '1rem',
            color: '#cccccc',
            marginBottom: '2rem',
            maxWidth: '500px'
          }}>
            Cuidando a tu mejor amigo con productos veterinarios de calidad.
          </div>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              style={{
                padding: '0.8rem 2rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '50px',
                transition: 'all 0.3s ease',
                fontFamily: "'Poppins', sans-serif",
                background: '#ff6600',
                color: 'black',
                boxShadow: '0 0 20px rgba(255, 102, 0, 0.5)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ff8533'
                e.target.style.transform = 'scale(1.05)'
                e.target.style.boxShadow = '0 0 30px rgba(255, 102, 0, 0.8)'
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#ff6600'
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = '0 0 20px rgba(255, 102, 0, 0.5)'
              }}
              onClick={handleExplorar}
            >
              Explorar Ahora
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
          }
          50% {
            text-shadow: 0 0 40px rgba(255, 102, 0, 0.8);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem !important;
          }
          .welcome-card {
            padding: 2rem !important;
            margin: 1rem !important;
          }
          .subtitle {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default WelcomePage