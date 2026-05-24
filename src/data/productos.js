// src/data/productos.js

const withBaseUrl = (ruta) => {
  if (typeof ruta !== "string") return ruta
  if (ruta.startsWith("http") || !ruta.startsWith("/")) return ruta

  // In this repo, GitHub Pages currently serves static files from main/root,
  // so product files are available under /public/productos/... paths.
  if (ruta.startsWith("/productos/")) {
    return `${import.meta.env.BASE_URL}public/${ruta.slice(1)}`
  }

  return `${import.meta.env.BASE_URL}${ruta.slice(1)}`
}

const productosRaw = [
  // ========== JABONES ==========
  { id: 1, nombre: "Jabón Azufre", precio: 80, categoria: "jabones", imagen: "/productos/jabon_azufre.jpg.webp" },
  { id: 2, nombre: "Jabón de Avena", precio: 150, categoria: "jabones", imagen: "/productos/jabon_avena.jpg.webp" },
  { id: 3, nombre: "Jabón de Clorexivet", precio: 230, categoria: "jabones", imagen: "/productos/jabon_clorexivet.jpg.webp" },
  { id: 4, nombre: "Jabón Asuntol", precio: 160, categoria: "jabones", imagen: "/productos/jabon_asunntol.jpg.webp" },
  { id: 5, nombre: "Jabón Vetridem", precio: 320, categoria: "jabones", imagen: "/productos/jabon_vetriderm.jpg.webp" },

  // ========== SHAMPOO / HIGIENE ==========
  { id: 6, nombre: "Seb Out Shampoo", precio: 280, categoria: "shampoo", imagen: "/productos/SHAMPOO SEB OUT.webp" },
  { id: 7, nombre: "Keroly Dic Shampoo", precio: 280, categoria: "shampoo", imagen: "/productos/SHAMPOO KEROLYTIC.webp" },
  { id: 8, nombre: "Shampoo Medic Veterinary", precio: 630, categoria: "shampoo", imagen: "/productos/SHAMPOO MEDIC VETERINAY.webp" },
  { id: 9, nombre: "Shampoo Clorexivet", precio: 300, categoria: "shampoo", imagen: "/productos/SHAMPOO CLOREXIVET.webp" },

  // ========== CREMAS / PIEL / CICATRIZANTES ==========
  { id: 10, nombre: "Herban Crema", precio: 225, categoria: "cremas", imagen: "/productos/HERBACT CREMA.webp" },
  { id: 11, nombre: "Crema a la piel", precio: 210, categoria: "cremas", imagen: "/productos/CREMA ALAPIEL.webp" },
  { id: 12, nombre: "Crema cicatrizante", precio: 140, categoria: "cremas", imagen: "/productos/CREMA CICATRIZANTE.webp" },

  // ========== ANTIBIOTICOS ==========
  { id: 13, nombre: "Doxy KO 100 (10)", precio: 15, categoria: "antibioticos", imagen: "/productos/DOXYKO 100 Mg.webp" },
  { id: 14, nombre: "Doxy KO 300 (10)", precio: 27, categoria: "antibioticos", imagen: "/productos/DOXYKO 300 Mg.webp" },
  { id: 15, nombre: "Doxy KO 100 mg (500)", precio: 11, categoria: "antibioticos", imagen: "/productos/DOXICICLINA CALOX 100 Mg.webp" },
  { id: 16, nombre: "Amoxiped Suspensión 250 mg", precio: 290, categoria: "antibioticos", imagen: "/productos/AMOXIPET 250 SUSPENCION.webp" },
  { id: 17, nombre: "Amoxiped Jr.", precio: 200, categoria: "antibioticos", imagen: "/productos/AMOXIPET JR.webp" },
  { id: 18, nombre: "Microflox 100 mg (20)", precio: 25, categoria: "antibioticos", imagen: "/productos/MICROFLOX 100 Mg.webp" },
  { id: 19, nombre: "Cefalexina 600 mg (32)", precio: 32, categoria: "antibioticos", imagen: "/productos/CEFALEXINA 600 Mg.webp" },
  { id: 20, nombre: "Estreptodex 6M (Penicilina)", precio: 300, categoria: "antibioticos", imagen: "/productos/ESTREPTODEX (PENISILINA).webp" },
  { id: 22, nombre: "Gandexill Doxiciclina", precio: 190, categoria: "antibioticos", imagen: "/productos/DOXICICLINA GALLO GOLILLERO.webp" },

  // ========== DESPARASITANTES INTERNOS ==========
  { id: 23, nombre: "Endopar Plus Tab (10)", precio: 40, categoria: "desparasitantes", imagen: "/productos/ENDOPAR PLUS.webp" },

  // ========== ANTIPULGAS / GARRAPATAS ==========
  { id: 24, nombre: "Quic Fip Spray", precio: 300, categoria: "antipulgas", imagen: "/productos/QUICFIP SPRAY PARA PULGAS.webp" },
  { id: 25, nombre: "Fluradog 2.4-4.5 kg", precio: 500, categoria: "antipulgas", imagen: "/productos/fluradog4.webp" },
  { id: 26, nombre: "Simparica 2.5-5 kg", precio: 500, categoria: "antipulgas", imagen: "/productos/SIMPARICA 2.5-5Kg.webp" },
  { id: 27, nombre: "Simparica 5-10 kg", precio: 580, categoria: "antipulgas", imagen: "/productos/SIMPARICA DE 5-10Kg.webp" },
  { id: 28, nombre: "Simparica 10-20 kg", precio: 650, categoria: "antipulgas", imagen: "/productos/SIMPARICA DE 10-20Kg.webp" },
  { id: 29, nombre: "Simparica 20-40 kg", precio: 700, categoria: "antipulgas", imagen: "/productos/SIMPARICA DE 20-40Kg.webp" },
  { id: 30, nombre: "Credelio 0.5-2 kg (Gato)", precio: 650, categoria: "antipulgas", imagen: "/productos/CREDELIO DE GATO DE 0.5-2Kg.webp" },
  { id: 31, nombre: "Credelio 2-8 kg (Gato)", precio: 680, categoria: "antipulgas", imagen: "/productos/CREDEIO DE GATO 2-8Kg.webp" },
  { id: 32, nombre: "Credelio 5.5-11 kg", precio: 550, categoria: "antipulgas", imagen: "/productos/CREDELIO DE 5.5-11Kg.webp" },
  { id: 33, nombre: "Credelio 11-22 kg", precio: 600, categoria: "antipulgas", imagen: "/productos/CREDELIO DE 11-22KG.webp" },
  { id: 34, nombre: "Credelio 22-45 kg", precio: 680, categoria: "antipulgas", imagen: "/productos/CREDELIO DE 22-45Kg.webp" },
  { id: 35, nombre: "Power Ultra 2-4 kg", precio: 210, categoria: "antipulgas", imagen: "/productos/POWE ULTRA (PIPETA) 2-4Kg.webp" },
  { id: 36, nombre: "Power Ultra 5-10 kg", precio: 220, categoria: "antipulgas", imagen: "/productos/POWER ULTRA DE 5-10 KG.webp" },
  { id: 37, nombre: "Power Gold 40-56 kg", precio: 1300, categoria: "antipulgas", imagen: "/productos/POWER GOLD DE 40-56Kg.webp" },
  { id: 38, nombre: "Linvet con Cipermetrina", precio: 300, categoria: "antipulgas", imagen: "/productos/SHAMPOO LINVET.webp" },
  { id: 39, nombre: "Flumeticol 100 ml", precio: 180, categoria: "antipulgas", imagen: "/productos/FLUMETICOL.webp" },
  { id: 40, nombre: "Flumeticol 200 ml", precio: 100, categoria: "antipulgas", imagen: "/productos/FLUMETICOL.webp" },
  { id: 81, nombre: "Alebo 1 mes 2-4.5 kg", precio: 330, categoria: "antipulgas", imagen: "/productos/ALEBO 1MES DE 2 A 4.5KG.webp" },
  { id: 82, nombre: "Alebo 1 mes 4.5-10 kg", precio: 360, categoria: "antipulgas", imagen: "/productos/ALEBO 1MES DE 4.5 A 10KG.webp" },
  { id: 83, nombre: "Alebo 1 mes 10-20 kg", precio: 430, categoria: "antipulgas", imagen: "/productos/ALEBO 1MES DE 10 A 20KG.webp" },
  { id: 84, nombre: "Alebo 1 mes 20-40 kg", precio: 580, categoria: "antipulgas", imagen: "/productos/ALEBO 1MES DE 20 A 40KG.webp" },


  // ========== MATABICHERAS ==========
  { id: 41, nombre: "Spray Matabichero 500 mg", precio: 310, categoria: "matabicheras", imagen: "/productos/spray-matabichero.webp" },
  { id: 42, nombre: "Kill Matabichera Spray", precio: 310, categoria: "matabicheras", imagen: "/productos/kill-matabichera.webp" },

  // ========== OTICOS ==========
  { id: 43, nombre: "Otico", precio: 230, categoria: "oticos", imagen: "/productos/OTIKO.webp" },
  { id: 44, nombre: "Otiplus", precio: 200, categoria: "oticos", imagen: "/productos/OTIPLUS.webp" },

  // ========== OFTALMICOS ==========
  { id: 45, nombre: "Gotas de ojos", precio: 180, categoria: "oftalmicos", imagen: "/productos/COLIRIO (GOTAS DE OJOS).webp" },

  // ========== MEDICAMENTOS ESTOMAGO / DIGESTIVOS ==========
  { id: 46, nombre: "Candonal (estómago/mal aliento)", precio: 17, categoria: "estomago", imagen: "/productos/CANDONTAL.webp" },
  { id: 47, nombre: "Gastrosol 5", precio: 18, categoria: "estomago", imagen: "/productos/GASTROZOL DE 5.webp" },
  { id: 48, nombre: "Gastrosol 20", precio: 18, categoria: "estomago", imagen: "/productos/GASTROZOL DE 20.webp" },
  { id: 49, nombre: "Metronidasol suspensión", precio: 150, categoria: "estomago", imagen: "/productos/METRONIDASOL.webp" },
  { id: 50, nombre: "Trimetropin sulfa suspensión", precio: 140, categoria: "estomago", imagen: "/productos/TRIMETROPIN.webp" },

  // ========== ANTIINFLAMATORIOS / DOLOR ==========
  { id: 51, nombre: "Meloxicam", precio: 16, categoria: "antiinflamatorios", imagen: "/productos/MELOXICAM.webp" },
  { id: 52, nombre: "Predisona 5 mg", precio: 11, categoria: "antiinflamatorios", imagen: "/productos/PREDISONA.webp" },
  { id: 53, nombre: "Kiropred 5", precio: 16, categoria: "antiinflamatorios", imagen: "/productos/KIROPRED DE 5.webp" },
  { id: 54, nombre: "Kiropred 20", precio: 16, categoria: "antiinflamatorios", imagen: "/productos/KIROPRED DE 20.webp" },
  { id: 55, nombre: "Kiropred 50", precio: 20, categoria: "antiinflamatorios", imagen: "/productos/KIROPRED DE 50.webp" },

  // ========== ARTICULACIONES ==========
  { id: 56, nombre: "Artrin Plus (18)", precio: 35, categoria: "articulaciones", imagen: "/productos/ARTRIN PLUS.webp" },
  { id: 57, nombre: "Artrin (30)", precio: 15, categoria: "articulaciones", imagen: "/productos/ARTRIN.webp" },

  // ========== ANTIFUNGICOS ==========
  { id: 58, nombre: "Fluconasol (Hongos)", precio: 30, categoria: "antifungicos", imagen: "/productos/FLUCONAZOL.webp" },

  // ========== SUPLEMENTOS / VITAMINAS ==========
  { id: 59, nombre: "Complejo B12 + Hierro", precio: 180, categoria: "suplementos", imagen: "/productos/COMPLEJO B12.webp" },
  { id: 60, nombre: "Calcio Vitaminado (Calsifor)", precio: 240, categoria: "suplementos", imagen: "/productos/CALCIO.webp" },
  { id: 61, nombre: "Amino-Bolic Forte", precio: 750, categoria: "suplementos", imagen: "/productos/animobolic.webp" },
  { id: 62, nombre: "Nutricell Pelo y Piel", precio: 400, categoria: "suplementos", imagen: "/productos/NUTRICELL PELO Y PIEL.webp" },
  { id: 63, nombre: "Nutricell Perro y Gato", precio: 420, categoria: "suplementos", imagen: "/productos/NUTRICELL PERRO Y GATO (PASTA).webp" },
  { id: 64, nombre: "Viyo Recuperación Perro", precio: 360, categoria: "suplementos", imagen: "/productos/VIYO RECUPERATION PERRO.webp" },
  { id: 65, nombre: "Viyo Recuperación Gato", precio: 360, categoria: "suplementos", imagen: "/productos/VIYO RECUPERATION GATO.webp" },
  { id: 66, nombre: "Viyo Fortalece Perro", precio: 80, categoria: "suplementos", imagen: "/productos/VIYO FORTALECE PERRO.webp" },
  { id: 67, nombre: "Viyo Fortalece Gato", precio: 80, categoria: "suplementos", imagen: "/productos/VUYO FORTALECE GATO.webp" },
  { id: 68, nombre: "Hepa-Tab", precio: 17, categoria: "suplementos", imagen: "/productos/HEPA-TAB.webp" },
  { id: 69, nombre: "PetTab", precio: 500, categoria: "suplementos", imagen: "/productos/PET-TAB.webp" },

  // ========== HIGIENE / FRAGANCIA ==========
  { id: 70, nombre: "Locion para perro (Talco)", precio: 200, categoria: "fragancia", imagen: "/productos/COLONIA PARA PERROS.webp" },

  // ========== ACCESORIOS ==========
  { id: 71, nombre: "Pecheras", precio: 900, categoria: "accesorios", imagen: "/productos/PECHERAS.webp" },
  { id: 72, nombre: "Collares", precio: 150, categoria: "accesorios", imagen: "/productos/COLLARES.webp" },
  { id: 73, nombre: "Peines", precio: 160, categoria: "accesorios", imagen: "/productos/PEINES 1.webp" },

  // ========== CUIDADO / RECUPERACION ==========
  { id: 74, nombre: "Isabelino 10", precio: 70, categoria: "cuidado", imagen: "/productos/ISABELINO.webp" },
  { id: 75, nombre: "Isabelino 15", precio: 110, categoria: "cuidado", imagen: "/productos/ISABELINO.webp" },
  { id: 76, nombre: "Isabelino 25", precio: 120, categoria: "cuidado", imagen: "/productos/ISABELINO.webp" },
  { id: 77, nombre: "Isabelino 30", precio: 170, categoria: "cuidado", imagen: "/productos/ISABELINO.webp" },

  // ========== JUGUETES ==========
  { id: 78, nombre: "Juguete para perro", precio: 150, categoria: "juguetes", imagen: "/productos/JUGUETES PARA PERRO.webp" },
  { id: 79, nombre: "Juguete para gato", precio: 120, categoria: "juguetes", imagen: "/productos/JUGUETES PARA GATO.webp" },

  // ========== ALIMENTACION ==========
  { id: 80, nombre: "Platos para comida", precio: 180, categoria: "alimentacion", imagen: "/productos/PLATOS-METALICOS-PARA-PERRO.webp" }
]

export const productos = productosRaw.map((producto) => ({
  ...producto,
  imagen: withBaseUrl(producto.imagen)
}))

// ========== CATEGORIAS ==========
export const categorias = [
  { id: "todos", nombre: "Todos", icono: "📦" },
  { id: "jabones", nombre: "Jabones", icono: "🧼" },
  { id: "shampoo", nombre: "Shampoo / Higiene", icono: "🧴" },
  { id: "cremas", nombre: "Cremas / Piel", icono: "🩹" },
  { id: "antibioticos", nombre: "Antibióticos", icono: "💊" },
  { id: "desparasitantes", nombre: "Desparasitantes Internos", icono: "🪱" },
  { id: "antipulgas", nombre: "Antipulgas / Garrapatas", icono: "🪳" },
  { id: "matabicheras", nombre: "Matabicheras", icono: "🦟" },
  { id: "oticos", nombre: "Óticos", icono: "👂" },
  { id: "oftalmicos", nombre: "Oftálmicos", icono: "👁️" },
  { id: "estomago", nombre: "Medicamentos Estómago", icono: "🫀" },
  { id: "antiinflamatorios", nombre: "Antiinflamatorios", icono: "💊" },
  { id: "articulaciones", nombre: "Articulaciones", icono: "🦴" },
  { id: "antifungicos", nombre: "Antifúngicos", icono: "🍄" },
  { id: "suplementos", nombre: "Suplementos / Vitaminas", icono: "💪" },
  { id: "fragancia", nombre: "Higiene / Fragancia", icono: "🌸" },
  { id: "accesorios", nombre: "Accesorios", icono: "🎀" },
  { id: "cuidado", nombre: "Cuidado / Recuperación", icono: "🩺" },
  { id: "juguetes", nombre: "Juguetes", icono: "🎾" },
  { id: "alimentacion", nombre: "Alimentación", icono: "🍽️" }
]

// Función para obtener productos por categoría
export const getProductosPorCategoria = (categoriaId) => {
  if (categoriaId === "todos") return productos
  return productos.filter(p => p.categoria === categoriaId)
}