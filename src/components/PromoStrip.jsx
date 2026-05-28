import { useEffect, useMemo, useState } from "react"

const EXTENSIONES_PROMO = ["webp", "jpeg", "jpg", "png", "avif"]

const rutaPromo = (nombre, extension) => {
  const base = `${import.meta.env.BASE_URL}productos/`
  return `${base}${encodeURIComponent(`${nombre}.${extension}`)}`
}

const promos = [
  {
    id: 1,
    titulo: "Promo 1",
    subtitulo: "Oferta especial para tu mascota",
    nombreArchivo: "PROMO 1"
  },
  {
    id: 2,
    titulo: "Promo 2",
    subtitulo: "Descuentos de temporada",
    nombreArchivo: "PROMO 2"
  },
  {
    id: 3,
    titulo: "Promo 3",
    subtitulo: "Lleva más y paga menos",
    nombreArchivo: "PROMO 3"
  },
  {
    id: 4,
    titulo: "Promo 4",
    subtitulo: "Recomendado por nuestros veterinarios",
    nombreArchivo: "PROMO 4"
  }
]

function PromoStrip() {
  const [activo, setActivo] = useState(0)
  const [extensionActiva, setExtensionActiva] = useState(EXTENSIONES_PROMO[0])

  const promoActiva = useMemo(() => promos[activo], [activo])
  const imagenActiva = useMemo(
    () => rutaPromo(promoActiva.nombreArchivo, extensionActiva),
    [promoActiva, extensionActiva]
  )

  useEffect(() => {
    setExtensionActiva(EXTENSIONES_PROMO[0])
  }, [activo])

  useEffect(() => {
    if (promos.length <= 1) return undefined

    const timer = setInterval(() => {
      setActivo((prev) => (prev + 1) % promos.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="px-4 pt-3 sm:px-6 sm:pt-4">
      <div className="relative overflow-hidden rounded-2xl border border-orange-500/30 bg-black/50 shadow-[0_10px_40px_rgba(249,115,22,0.2)]">
        <img
          src={imagenActiva}
          alt={promoActiva.titulo}
          className="h-[220px] w-full bg-black object-contain sm:h-[300px]"
          loading="eager"
          onError={(event) => {
            const target = event.currentTarget
            const idxActual = EXTENSIONES_PROMO.indexOf(extensionActiva)

            if (idxActual >= 0 && idxActual < EXTENSIONES_PROMO.length - 1) {
              setExtensionActiva(EXTENSIONES_PROMO[idxActual + 1])
              return
            }

            target.src = `${import.meta.env.BASE_URL}productos/PROMOCION.webp`
          }}
        />

        <div className="absolute bottom-3 right-3 flex gap-2 sm:bottom-4 sm:right-4">
          {promos.map((promo, index) => (
            <button
              key={promo.id}
              type="button"
              onClick={() => setActivo(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                index === activo ? "w-6 bg-orange-400" : "bg-white/60 hover:bg-white"
              }`}
              aria-label={`Ver promoción ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromoStrip