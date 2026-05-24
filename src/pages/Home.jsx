// src/pages/Home.jsx
import { useRef, useState } from "react"
import { productos, categorias, getProductosPorCategoria } from "../data/productos"
import Product from "../components/Product"

function Home({ agregarAlCarrito, carrito }) {
  const [busqueda, setBusqueda] = useState("")
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos")
  const [categoriasAbiertas, setCategoriasAbiertas] = useState(false)
  const productosSectionRef = useRef(null)

  const seleccionarCategoria = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId)
    requestAnimationFrame(() => {
      productosSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      })
    })
  }

  const esRutaImagen = (valor) =>
    typeof valor === "string" &&
    (valor.startsWith("/") || valor.startsWith("http"))

  const fallbackImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23111827'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23f59e0b' font-size='18' font-family='Arial'%3EPetWorld%3C/text%3E%3C/svg%3E"

  const productosMostrar = getProductosPorCategoria(categoriaSeleccionada)

  const productosFiltrados = productosMostrar.filter(producto => {
    const textoBusqueda = busqueda.toLowerCase()
    const nombreProducto = producto.nombre.toLowerCase()
    return nombreProducto.includes(textoBusqueda)
  })

  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Ember Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.6) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.3) 0%, transparent 80%)
          `,
        }}
      />
      {/* Content */}
      <div className="relative z-10 px-4 py-5 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-6 text-white">Productos PetWorld</h2>
      
      {/* Buscador */}
      <div className="mb-5 sm:mb-6 sticky top-[72px] z-30 md:static md:top-auto md:z-auto bg-black/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-0 rounded-xl md:rounded-none p-3 md:p-0 border border-orange-500/20 md:border-0">
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-orange-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-black/50 text-white placeholder-orange-200 backdrop-blur-sm text-sm sm:text-base"
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")} className="absolute inset-y-0 right-0 pr-3 flex items-center text-orange-300 hover:text-orange-100">
              ✖
            </button>
          )}
        </div>

        {/* Resultados de búsqueda debajo del buscador */}
        {busqueda && (
          <div className="mt-3 sm:mt-4 bg-black/50 rounded-xl border border-orange-500/30 backdrop-blur-sm p-3 sm:p-4 max-w-md w-full">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🔍</div>
                <p className="text-orange-200 text-sm">No encontramos productos con "{busqueda}"</p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-orange-300 mb-3">
                  {productosFiltrados.length} resultado(s)
                </p>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {productosFiltrados.map(producto => (
                    <div
                      key={producto.id}
                      className="flex items-center gap-3 p-2 bg-black/70 rounded-lg hover:bg-orange-900/30 transition cursor-pointer hover:border-l-2 hover:border-orange-500"
                      onClick={() => {
                        setBusqueda("")
                        setCategoriaSeleccionada("todos")
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                    >
                      {esRutaImagen(producto.imagen) ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-12 h-12 rounded object-cover"
                          loading="lazy"
                          decoding="async"
                          width="48"
                          height="48"
                          onError={(e) => {
                            e.currentTarget.src = fallbackImage
                          }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-black/50 border border-orange-500/20 flex items-center justify-center text-2xl">
                          {producto.imagen}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{producto.nombre}</p>
                        <p className="text-xs text-orange-300">L {producto.precio}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          agregarAlCarrito(producto)
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs transition"
                      >
                        +🛒
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Categorías desplegables arriba */}
      <div ref={productosSectionRef} className="mb-5 scroll-mt-24">
        <button
          onClick={() => setCategoriasAbiertas(prev => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/50 border border-orange-500/30 text-orange-200 hover:bg-orange-900/30 hover:border-orange-500 transition-all font-semibold text-sm"
        >
          <span>📁 Categorías</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${categoriasAbiertas ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {categoriaSeleccionada !== "todos" && (
            <span className="ml-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
              {categorias.find(c => c.id === categoriaSeleccionada)?.nombre}
            </span>
          )}
        </button>

        {categoriasAbiertas && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => { seleccionarCategoria(cat.id); setCategoriasAbiertas(false) }}
                className={`p-3 rounded-xl text-left transition-all backdrop-blur-sm flex items-center gap-2 ${
                  categoriaSeleccionada === cat.id
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/50"
                    : "bg-black/50 text-orange-200 hover:bg-orange-900/30 shadow border border-orange-500/30 hover:border-orange-500"
                }`}
              >
                <div className="text-xl">{cat.icono}</div>
                <div className="text-sm font-medium truncate">{cat.nombre}</div>
              </button>
            ))}
          </div>
        )}
      </div>

        {/* Productos */}
        <div>
          {productosFiltrados.length === 0 ? (
            <div className="text-center py-12 bg-black/50 rounded-xl border border-orange-500/30 backdrop-blur-sm">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-orange-200">No encontramos productos</h3>
              <button onClick={() => { setBusqueda(""); setCategoriaSeleccionada("todos") }} className="mt-4 text-orange-400 hover:text-orange-300 transition-colors">
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-orange-300 mb-4">
                {productosFiltrados.length} producto(s) encontrado(s)
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 auto-rows-fr">
                {productosFiltrados.map(producto => (
                  <Product
                    key={producto.id}
                    id={producto.id}
                    nombre={producto.nombre}
                    precio={producto.precio}
                    imagen={producto.imagen}
                    cantidadEnCarrito={carrito?.find(item => item.id === producto.id)?.cantidad || 0}
                    onAgregar={() => agregarAlCarrito(producto)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home