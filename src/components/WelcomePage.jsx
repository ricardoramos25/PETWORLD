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
    const PARTICLE_COUNT = 150
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

  const handleWhatsApp = () => {
    const mensaje = encodeURIComponent("Hola, quiero hacer una consulta sobre los productos de PETWORLD")
    window.location.assign(`https://wa.me/50499288926?text=${mensaje}`)
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
        {/* Presentación breve */}
        <div className="welcome-card" style={{
          width: 'min(92%, 700px)',
          maxHeight: 'calc(100vh - 3rem)',
          overflowY: 'auto',
          background: 'linear-gradient(145deg, rgba(20,20,20,.92), rgba(7,7,7,.82))',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
          borderRadius: '28px',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          border: '1px solid rgba(255, 153, 51, .58)',
          boxShadow: '0 24px 80px rgba(0,0,0,.65), 0 0 55px rgba(255,102,0,.18), inset 0 1px rgba(255,255,255,.08)',
          animation: 'slideIn .8s cubic-bezier(.2,.8,.2,1)',
          boxSizing: 'border-box',
          position: 'relative'
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute',
            inset: '-1px',
            borderRadius: '28px',
            background: 'linear-gradient(120deg, transparent 20%, rgba(255,153,51,.16), transparent 55%)',
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.5rem',
              padding: '.45rem .85rem',
              marginBottom: '1.1rem',
              borderRadius: '999px',
              color: '#ffc07a',
              background: 'rgba(255,102,0,.10)',
              border: '1px solid rgba(255,153,51,.28)',
              fontSize: '.75rem',
              fontWeight: 700,
              letterSpacing: '1.5px',
              textTransform: 'uppercase'
            }}>
              <span style={{ animation: 'pulseDot 1.8s infinite', width: 7, height: 7, borderRadius: '50%', background: '#ff9933', boxShadow: '0 0 12px #ff9933' }} />
              Bienvenido a PETWORLD
            </div>

            <h1 className="welcome-title" style={{
              fontSize: 'clamp(3rem, 10vw, 5.5rem)',
              lineHeight: .92,
              margin: '0 0 1.35rem',
              background: 'linear-gradient(135deg, #ff6600 15%, #ffb347 55%, #ff7a1a 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 8px 24px rgba(255,102,0,.22))',
              letterSpacing: '-3px'
            }}>
              PETWORLD
            </h1>

            <div className="welcome-description" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '.75rem',
              color: '#ececec',
              textAlign: 'left',
              margin: '0 0 1.5rem'
            }}>
              <div className="welcome-info-card" style={{
                padding: '1rem',
                borderRadius: '16px',
                background: 'rgba(255,255,255,.045)',
                border: '1px solid rgba(255,255,255,.08)'
              }}>
                <div style={{ color: '#ff9933', fontSize: '1.7rem', marginBottom: '.25rem' }}>🐾</div>
                <strong style={{ display: 'block', color: '#ffb347', marginBottom: '.35rem' }}>¿Quiénes somos?</strong>
                <span style={{ fontSize: '.9rem', lineHeight: 1.45, color: '#d7d7d7' }}>
                  Una tienda dedicada a la salud y el cuidado animal.
                </span>
              </div>

              <div className="welcome-info-card" style={{
                padding: '1rem',
                borderRadius: '16px',
                background: 'rgba(255,255,255,.045)',
                border: '1px solid rgba(255,255,255,.08)'
              }}>
                <div style={{ color: '#ff9933', fontSize: '1.7rem', marginBottom: '.25rem' }}>🩺</div>
                <strong style={{ display: 'block', color: '#ffb347', marginBottom: '.35rem' }}>¿Qué hacemos?</strong>
                <span style={{ fontSize: '.9rem', lineHeight: 1.45, color: '#d7d7d7' }}>
                  Ofrecemos productos y facilitamos consultas rápidas por WhatsApp.
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '.75rem', flexWrap: 'wrap' }}>
              <button
                className="store-button"
                onClick={handleExplorar}
                style={{
                  position: 'relative',
                  minHeight: '54px',
                  width: 'min(100%, 280px)',
                  padding: '.9rem 1.8rem',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  border: '1px solid #ffc078',
                  cursor: 'pointer',
                  borderRadius: '999px',
                  fontFamily: "'Poppins', sans-serif",
                  background: 'linear-gradient(135deg, #ff7a1a, #ffb347)',
                  color: '#171100',
                  boxShadow: '0 12px 30px rgba(255,102,0,.32), inset 0 1px rgba(255,255,255,.55)',
                  transition: 'transform .25s ease, box-shadow .25s ease, filter .25s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 16px 38px rgba(255,102,0,.48), inset 0 1px rgba(255,255,255,.65)'
                  e.currentTarget.style.filter = 'brightness(1.06)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,102,0,.32), inset 0 1px rgba(255,255,255,.55)'
                  e.currentTarget.style.filter = 'none'
                }}
              >
                Ir a la tienda <span style={{ marginLeft: '.35rem' }}>→</span>
              </button>

              <button
                onClick={handleWhatsApp}
                style={{
                  minHeight: '54px',
                  width: 'min(100%, 280px)',
                  padding: '.9rem 1.8rem',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  border: '1px solid #86efac',
                  cursor: 'pointer',
                  borderRadius: '999px',
                  fontFamily: "'Poppins', sans-serif",
                  background: 'linear-gradient(135deg, #25D366, #86efac)',
                  color: '#083d1a',
                  boxShadow: '0 12px 30px rgba(37,211,102,.28), inset 0 1px rgba(255,255,255,.55)',
                  transition: 'transform .25s ease, box-shadow .25s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 16px 38px rgba(37,211,102,.42)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(37,211,102,.28)'
                }}
              >
                💬 Consultar por WhatsApp
              </button>
            </div>
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

        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.55); opacity: .55; }
        }

        @media (max-width: 768px) {
          .welcome-card {
            width: calc(100% - 2rem) !important;
            max-height: calc(100vh - 2rem);
            overflow-y: auto;
            padding: 1.5rem 1.25rem !important;
            border-radius: 18px;
          }
          .welcome-title {
            font-size: clamp(2.25rem, 12vw, 3.25rem) !important;
            margin-bottom: 1rem !important;
          }
          .welcome-description {
            font-size: 0.92rem !important;
            line-height: 1.45 !important;
            margin-bottom: 1.25rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default WelcomePage