# PetWorld - Tienda Veterinaria Online

Una aplicación React moderna para la venta de productos veterinarios con autenticación de Google y envío de pedidos por enlace directo de WhatsApp.

## 🚀 Características

- 🛒 Carrito de compras interactivo
- 🔐 Autenticación con Google (Firebase)
- 📱 Diseño responsivo con Tailwind CSS
- 🐾 Interfaz amigable para amantes de mascotas
- 📊 Historial de compras
- 🎨 Animaciones y transiciones suaves
- 📱 **Envío de pedidos por enlace wa.me (sin backend)**

## 🛠️ Configuración

### 1. Instalar dependencias del frontend

```bash
npm install
```

### 2. Configurar Firebase

**Paso 1:** Ve a [Firebase Console](https://console.firebase.google.com/)

**Paso 2:** Crea un nuevo proyecto o selecciona uno existente

**Paso 3:** Habilita Authentication:
   - Ve a Authentication > Sign-in method
   - Habilita "Google" como proveedor de inicio de sesión

**Paso 4:** Obtén las credenciales:
   - Ve a Project settings > General
   - En "Your apps", haz clic en el ícono de Web (</>)
   - Copia la configuración de Firebase

**Paso 5:** Actualiza el archivo `.env.local`:

```env
# Firebase Configuration (reemplaza con tus valores reales)
VITE_FIREBASE_API_KEY=tu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 3. ⚡ Configurar envío por WhatsApp (wa.me)

No se requiere backend. El frontend abre WhatsApp con el pedido prellenado.

Agrega este valor en tu archivo `.env.local`:

```env
VITE_WHATSAPP_ADMIN_NUMBER=50497481926
```

Notas:
- Usa formato internacional sin + ni espacios.
- Ejemplo Honduras: 504XXXXXXXX.

### 4. Ejecutar la aplicación

```bash
# Modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Docker (rápido y eficiente)

Se agregó una configuración Docker optimizada para dos escenarios:

- Desarrollo con recarga en caliente: `petworld-dev`
- Producción con build estático + Nginx: `petworld-prod`

### Flujo recomendado: todo con Docker

1. Crear archivo de variables:

```bash
cp .env.docker.example .env.docker
```

En Windows PowerShell:

```powershell
Copy-Item .env.docker.example .env.docker
```

2. Desarrollo (hot reload):

```bash
docker compose up petworld-dev --build
```

3. Producción local (Nginx):

```bash
docker compose --env-file .env.docker up petworld-prod --build
```

4. Detener contenedores:

```bash
docker compose down
```

### Ejecutar en desarrollo (Docker)

```bash
docker compose up petworld-dev --build
```

La app queda disponible en:

```bash
http://localhost:5173
```

### Ejecutar en producción (Docker)

Primero crea tu archivo de variables para Docker:

```bash
cp .env.docker.example .env.docker
```

En Windows PowerShell:

```powershell
Copy-Item .env.docker.example .env.docker
```

Luego ejecuta:

```bash
docker compose --env-file .env.docker up petworld-prod --build
```

La app queda disponible en:

```bash
http://localhost:8080
```

### Detener contenedores

```bash
docker compose down
```

### Notas de rendimiento incluidas

- `npm ci` para instalaciones reproducibles y más rápidas en contenedor
- Multi-stage build para imagen final liviana
- Nginx con compresión `gzip` y cache de assets estáticos
- Volúmenes en desarrollo para evitar reinstalar dependencias en cada cambio

## Seguridad de variables

- Los archivos `.env`, `.env.local` y `.env.docker` no deben subirse al repositorio.
- Solo `.env.example` y `.env.docker.example` deben permanecer versionados.
- En Vite, cualquier variable con prefijo `VITE_` se expone en el navegador al compilar.
- Por eso, en este proyecto solo deben vivir en `VITE_` valores públicos de cliente como la configuración de Firebase o el número de WhatsApp.
- Claves privadas, tokens secretos, credenciales de servidor o llaves administrativas no deben ponerse nunca en variables `VITE_`; eso requiere un backend.

## 📁 Estructura del proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Barra de navegación
│   ├── Carrito.jsx     # Modal del carrito
│   ├── Product.jsx     # Tarjeta de producto
│   ├── SplashScreen.jsx # Pantalla de carga
│   └── Footer.jsx      # Pie de página
├── pages/              # Páginas de la aplicación
│   ├── Home.jsx        # Página principal
│   ├── LoginPage.jsx   # Página de inicio de sesión
│   └── RegistroPage.jsx # Página de registro
├── context/            # Contextos de React
│   └── AuthContext.jsx # Contexto de autenticación
├── firebase/           # Configuración de Firebase
│   └── config.js       # Configuración y funciones de Firebase
├── data/               # Datos estáticos
│   └── productos.js    # Lista de productos
└── assets/             # Recursos estáticos
```

## 🔧 Tecnologías utilizadas

- **React 19** - Framework principal
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Firebase** - Autenticación y almacenamiento de compras
- **React Router** - Navegación
- **Lucide React** - Iconos

## 📝 Notas importantes

- Asegúrate de configurar correctamente las credenciales de Firebase
- Configura `VITE_WHATSAPP_ADMIN_NUMBER` para definir el número que recibirá pedidos
- El proyecto incluye un sistema de autenticación híbrido (localStorage + Firebase)
- Los productos se almacenan localmente en `src/data/productos.js`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
