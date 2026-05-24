import { useEffect, useState } from "react"

const normalizarTexto = (texto) =>
  texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()

const etiquetasUnidadPorProducto = new Map(
  [
    ["Doxy KO 100 (10)", "Por unidad"],
    ["Doxy KO 300 (10)", "Por unidad"],
    ["Doxy KO 100 mg (500)", "Por unidad"],
    ["Microflox 100 mg (20)", "Por unidad"],
    ["Cefalexina 600 mg (32)", "Por unidad"],
    ["Ciprofloxacina 0.3%", "Por unidad"],
    ["Endopar Plus Tab (10)", "Por unidad"],
    ["Fluradog 2.4-4.5 kg", "Por unidad"],
    ["Simparica 2.5-5 kg", "Por unidad"],
    ["Simparica 5-10 kg", "Por unidad"],
    ["Simparica 10-20 kg", "Por unidad"],
    ["Simparica 20-40 kg", "Por unidad"],
    ["Credelio 0.5-2 kg (Gato)", "Por unidad"],
    ["Credelio 2-8 kg (Gato)", "Por unidad"],
    ["Credelio 5.5-11 kg", "Por unidad"],
    ["Credelio 11-22 kg", "Por unidad"],
    ["Credelio 22-45 kg", "Por unidad"],
    ["Power Gold 40-56 kg", "Por unidad"],
    ["Power Ultra 2-4 kg", "Por unidad"],
    ["Power Ultra 5-10 kg", "Por unidad"],
    ["Alebo 1 mes 2-4.5 kg", "Por unidad"],
    ["Alebo 1 mes 4.5-10 kg", "Por unidad"],
    ["Alebo 1 mes 10-20 kg", "Por unidad"],
    ["Alebo 1 mes 20-40 kg", "Por unidad"],
    ["Fluconasol (Hongos)", "Por unidad"],
    ["Candonal (estómago/mal aliento)", "Por unidad"],
    ["Gastrosol 5", "Por unidad"],
    ["Gastrosol 20", "Por unidad"],
    ["Meloxicam", "Por unidad"],
    ["Predisona 5 mg", "Por unidad"],
    ["Kiropred 5", "Por unidad"],
    ["Kiropred 20", "Por unidad"],
    ["Kiropred 50", "Por unidad"],
    ["Artrin Plus (18)", "Por unidad"],
    ["Artrin (30)", "Por unidad"],
    ["Amino-Bolic Forte", "Por unidad"],
    ["Hepa-Tab", "Por unidad"],
    ["PetTab", "10 c/u"]
  ].map(([nombreProducto, etiqueta]) => [normalizarTexto(nombreProducto), etiqueta])
)

function Product({ nombre, precio, imagen, onAgregar, cantidadEnCarrito = 0 }) {
  const [mostrarImagenCompleta, setMostrarImagenCompleta] = useState(false)
  const esRutaImagen =
    typeof imagen === "string" &&
    (imagen.startsWith("/") || imagen.startsWith("http"));

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='450'%3E%3Crect width='100%25' height='100%25' fill='%23111827'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23f59e0b' font-size='28' font-family='Arial'%3EPetWorld%3C/text%3E%3C/svg%3E";

  const etiquetaUnidad = etiquetasUnidadPorProducto.get(normalizarTexto(nombre)) ?? null

  useEffect(() => {
    if (!mostrarImagenCompleta) return

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMostrarImagenCompleta(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [mostrarImagenCompleta])

  return (
    <>
      <article className="bg-black/50 backdrop-blur-sm shadow-lg rounded-2xl p-3 sm:p-4 hover:shadow-xl hover:shadow-orange-500/20 transition relative border border-orange-500/30 h-full flex flex-col overflow-hidden min-w-0">
        {cantidadEnCarrito > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-lg">
            {cantidadEnCarrito}
          </div>
        )}

        {imagen && esRutaImagen && (
          <div className="mb-2 sm:mb-3 w-full rounded-lg overflow-hidden border border-orange-500/20 aspect-[4/3] bg-black/30">
            <img
              src={imagen}
              alt={nombre}
              className="w-full h-full object-cover cursor-zoom-in"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              width="600"
              height="450"
              onClick={() => setMostrarImagenCompleta(true)}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
            />
          </div>
        )}

        {imagen && !esRutaImagen && (
          <div className="mb-2 sm:mb-3 w-full rounded-lg bg-black/40 border border-orange-500/20 flex items-center justify-center text-4xl sm:text-6xl aspect-[4/3]">
            {imagen}
          </div>
        )}

        <h3 className="text-sm sm:text-xl font-bold text-white mb-1 sm:mb-2 leading-tight h-[2.75rem] sm:h-[3.5rem] overflow-hidden break-words">
          {nombre}
        </h3>
        <p className="text-orange-300 font-semibold text-sm sm:text-lg">L {precio}</p>

        {etiquetaUnidad && (
          <p className="mt-1 text-[11px] sm:text-xs font-medium text-blue-400">
            {etiquetaUnidad}
          </p>
        )}

        <button
          onClick={onAgregar}
          className="mt-3 w-full bg-orange-500 text-white py-2.5 rounded-lg hover:bg-orange-600 transition shadow-lg hover:shadow-orange-500/50 text-xs sm:text-base font-medium active:scale-[0.99]"
        >
          Agregar al carrito
        </button>
      </article>

      {mostrarImagenCompleta && esRutaImagen && (
        <div
          className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setMostrarImagenCompleta(false)}
        >
          <button
            onClick={() => setMostrarImagenCompleta(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white text-xl font-bold hover:bg-white/20 transition"
            aria-label="Cerrar imagen"
          >
            X
          </button>
          <img
            src={imagen}
            alt={nombre}
            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
          <button
            onClick={() => setMostrarImagenCompleta(false)}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg transition"
            aria-label="Cerrar imagen"
          >
            Cerrar imagen
          </button>
        </div>
      )}
    </>
  )
}

export default Product