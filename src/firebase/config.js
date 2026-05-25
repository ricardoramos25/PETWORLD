// src/firebase/config.js
import { initializeApp } from "firebase/app"
import { 
  getAuth, 
  GoogleAuthProvider, 
  getRedirectResult,
  signInWithPopup, 
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  setDoc,
  increment
} from "firebase/firestore"
import { normalizeEmail, sanitizeTextInput, validateLoginInput } from "../services/authSecurity"

// Valores por defecto para evitar pantalla en blanco en deploys sin .env (GitHub Pages)
const firebaseDefaults = {
  apiKey: "AIzaSyB6I5m11_-nZJxx4AEqXZAmM6mPRSSH0Cg",
  authDomain: "petworld-94eb4.firebaseapp.com",
  projectId: "petworld-94eb4",
  storageBucket: "petworld-94eb4.firebasestorage.app",
  messagingSenderId: "1056118883413",
  appId: "1:1056118883413:web:08a8dc82053afb713700dc"
}

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseDefaults.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseDefaults.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseDefaults.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseDefaults.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseDefaults.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseDefaults.appId
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })

void setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("No se pudo establecer la persistencia de Firebase:", error)
})

const getCurrentHost = () => {
  if (typeof window === "undefined") return "tu-dominio"
  return window.location.hostname || "tu-dominio"
}

const esDispositivoMovil = () => {
  if (typeof window === "undefined") return false

  const esPantallaPequena = window.matchMedia("(max-width: 768px)").matches
  const userAgent = navigator.userAgent || ""
  const esMovilPorUserAgent = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(userAgent)

  return esPantallaPequena || esMovilPorUserAgent
}

const esEntornoLocal = () => {
  if (typeof window === "undefined") return false
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
}

const debeUsarRedirectGoogle = () => esDispositivoMovil() || !esEntornoLocal()

const mapUserToAuthResult = async (user) => {
  const userDoc = await asegurarDocumentoUsuario(user)

  return {
    exito: true,
    usuario: {
      id: user.uid,
      nombre: user.displayName,
      email: user.email,
      foto: user.photoURL,
      telefono: user.phoneNumber || "",
      direccion: "",
      ciudad: "",
      fechaRegistro: user.metadata.creationTime,
      puntos: userDoc.exists() ? userDoc.data().puntos : 0
    }
  }
}

const asegurarDocumentoUsuario = async (user) => {
  const userRef = doc(db, "usuarios", user.uid)
  const userDoc = await getDoc(userRef)

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      nombre: user.displayName,
      email: user.email,
      foto: user.photoURL,
      telefono: user.phoneNumber || "",
      direccion: "",
      ciudad: "",
      fechaRegistro: new Date().toISOString(),
      puntos: 0,
      totalCompras: 0,
      rol: "cliente"
    })
  } else {
    const datosActuales = userDoc.data()
    const cambios = {}

    if (user.displayName && datosActuales.nombre !== user.displayName) {
      cambios.nombre = user.displayName
    }

    if (user.email && datosActuales.email !== user.email) {
      cambios.email = user.email
    }

    if (user.photoURL && datosActuales.foto !== user.photoURL) {
      cambios.foto = user.photoURL
    }

    if (user.phoneNumber && datosActuales.telefono !== user.phoneNumber) {
      cambios.telefono = user.phoneNumber
    }

    if (Object.keys(cambios).length > 0) {
      await updateDoc(userRef, cambios)
    }
  }

  return userDoc
}

const mapAuthErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "El correo no tiene un formato valido."
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Credenciales invalidas."
    case "auth/too-many-requests":
      return "Demasiados intentos. Espera un momento e intenta de nuevo."
    case "auth/email-already-in-use":
      return "Este correo ya esta registrado."
    case "auth/weak-password":
      return "La contrasena es demasiado debil."
    case "auth/network-request-failed":
      return "Error de red. Verifica tu conexion e intenta nuevamente."
    case "auth/unauthorized-domain":
      return `Dominio no autorizado en Firebase. Agrega ${getCurrentHost()} en Authentication > Settings > Authorized domains.`
    case "auth/operation-not-allowed":
      return "El proveedor Google no esta habilitado en Firebase Authentication > Sign-in method."
    case "auth/popup-closed-by-user":
      return "Se cerro la ventana de Google antes de completar el inicio de sesion."
    case "auth/popup-blocked":
      return "El navegador bloqueo la ventana emergente. Se recomienda permitir popups para este sitio."
    case "auth/invalid-api-key":
      return "La API key de Firebase es invalida. Revisa tus variables VITE_FIREBASE_* en .env."
    case "auth/app-not-authorized":
      return "Esta app no esta autorizada para Firebase Authentication. Revisa la configuracion del proyecto."
    default:
      return `No se pudo completar la autenticacion (${errorCode || "sin-codigo"}). Intenta nuevamente.`
  }
}

// ========== FUNCIONES DE AUTENTICACIÓN ==========
export const loginWithGoogle = async () => {
  try {
    if (debeUsarRedirectGoogle()) {
      await signInWithRedirect(auth, googleProvider)
      return { exito: true, redireccion: true }
    }

    const result = await signInWithPopup(auth, googleProvider)
    return mapUserToAuthResult(result.user)
  } catch (error) {
    if (error?.code === "auth/popup-blocked" || error?.code === "auth/cancelled-popup-request") {
      try {
        await signInWithRedirect(auth, googleProvider)
        return { exito: true, redireccion: true }
      } catch (redirectError) {
        console.error("Error en redirect de Google:", redirectError)
        return {
          exito: false,
          codigo: redirectError?.code,
          mensaje: mapAuthErrorMessage(redirectError?.code)
        }
      }
    }

    console.error("Error:", error)
    return {
      exito: false,
      codigo: error?.code,
      mensaje: mapAuthErrorMessage(error?.code)
    }
  }
}

export const resolverLoginRedirectGoogle = async () => {
  try {
    const result = await getRedirectResult(auth)
    if (!result?.user) {
      return { exito: false, sinResultado: true }
    }

    return mapUserToAuthResult(result.user)
  } catch (error) {
    console.error("Error procesando redirect de Google:", error)
    return {
      exito: false,
      codigo: error?.code,
      mensaje: mapAuthErrorMessage(error?.code)
    }
  }
}

export const logoutFromGoogle = async () => {
  try {
    await signOut(auth)
    return { exito: true }
  } catch (error) {
    return { exito: false, mensaje: mapAuthErrorMessage(error?.code) }
  }
}

export const registrarUsuario = async (nombre, email, password, telefono = "") => {
  try {
    const nombreSeguro = sanitizeTextInput(nombre, 80)
    const emailSeguro = normalizeEmail(email)
    const telefonoSeguro = sanitizeTextInput(telefono, 25)

    const userCredential = await createUserWithEmailAndPassword(auth, emailSeguro, password)
    const user = userCredential.user
    
    // Crear documento del usuario en Firestore
    const usuarioData = {
      id: user.uid,
      nombre: nombreSeguro,
      email: emailSeguro,
      telefono: telefonoSeguro,
      direccion: "",
      ciudad: "",
      fechaRegistro: new Date().toISOString(),
      puntos: 0,
      totalCompras: 0
    }
    
    await setDoc(doc(db, "usuarios", user.uid), usuarioData)
    
    return { exito: true, usuario: usuarioData }
  } catch (error) {
    console.error("Error al registrar:", error)
    return {
      exito: false,
      codigo: error?.code,
      mensaje: mapAuthErrorMessage(error?.code)
    }
  }
}

export const loginConEmail = async (email, password) => {
  try {
    const validation = validateLoginInput(email, password)
    if (!validation.valid) {
      return { exito: false, mensaje: validation.message }
    }

    const userCredential = await signInWithEmailAndPassword(auth, validation.email, validation.password)
    const user = userCredential.user
    
    // Obtener datos adicionales del usuario desde Firestore
    const userDoc = await getDoc(doc(db, "usuarios", user.uid))
    
    return {
      exito: true,
      usuario: {
        id: user.uid,
        nombre: userDoc.exists() ? userDoc.data().nombre : user.displayName || user.email.split('@')[0],
        email: user.email,
        foto: user.photoURL,
        telefono: userDoc.exists() ? userDoc.data().telefono : "",
        direccion: userDoc.exists() ? userDoc.data().direccion : "",
        ciudad: userDoc.exists() ? userDoc.data().ciudad : "",
        fechaRegistro: user.metadata.creationTime,
        puntos: userDoc.exists() ? userDoc.data().puntos : 0
      }
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error)
    return {
      exito: false,
      codigo: error?.code,
      mensaje: mapAuthErrorMessage(error?.code)
    }
  }
}

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        await asegurarDocumentoUsuario(firebaseUser)
      } catch (error) {
        console.error("Error al asegurar documento del usuario:", error)
      }
    }
    callback(firebaseUser)
  })
}

export const obtenerUsuarioPorId = async (usuarioId) => {
  try {
    const userRef = doc(db, "usuarios", usuarioId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      return { exito: false, mensaje: "Usuario no encontrado" }
    }

    return { exito: true, usuario: userDoc.data() }
  } catch (error) {
    return { exito: false, mensaje: error.message }
  }
}

// ========== FUNCIÓN PARA GUARDAR PEDIDO ==========
export const guardarPedido = async (pedido) => {
  try {
    const pedidosRef = collection(db, "pedidos")
    const nuevoPedido = {
      ...pedido,
      fecha: new Date().toISOString(),
      fechaTimestamp: Date.now(),
      estado: "pendiente",
      estadoColor: "bg-yellow-100 text-yellow-700"
    }
    
    const docRef = await addDoc(pedidosRef, nuevoPedido)
    
    // Actualizar puntos del usuario si está autenticado
    if (pedido.usuarioId) {
      const userRef = doc(db, "usuarios", pedido.usuarioId)
      const puntosGanados = Math.floor(pedido.total / 100)
      await updateDoc(userRef, {
        puntos: increment(puntosGanados),
        totalCompras: increment(1)
      })
    }
    
    return { exito: true, id: docRef.id }
  } catch (error) {
    console.error("Error al guardar pedido:", error)
    return { exito: false, mensaje: error.message }
  }
}

// ========== FUNCIÓN PARA OBTENER PEDIDOS ==========
export const obtenerPedidos = async () => {
  try {
    const pedidosRef = collection(db, "pedidos")
    const q = query(pedidosRef, orderBy("fecha", "desc"))
    const snapshot = await getDocs(q)
    const pedidos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { exito: true, pedidos }
  } catch (error) {
    return { exito: false, mensaje: error.message }
  }
}

export const obtenerPedidosPorUsuario = async (usuarioId) => {
  try {
    const pedidosRef = collection(db, "pedidos")
    const q = query(pedidosRef, where("usuarioId", "==", usuarioId), orderBy("fecha", "desc"))
    const snapshot = await getDocs(q)
    const pedidos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { exito: true, pedidos }
  } catch (error) {
    return { exito: false, mensaje: error.message }
  }
}

// ========== FUNCIÓN PARA GUARDAR CONSULTA MÉDICA VETERINARIA ==========
export const guardarConsultaMedica = async (usuarioId, nombreUsuario, emailUsuario) => {
  try {
    const consultasRef = collection(db, "consultasMedicas")
    
    const consultaData = {
      usuarioId: usuarioId,
      nombreUsuario: nombreUsuario,
      emailUsuario: emailUsuario,
      fecha: new Date().toISOString(),
      tipo: "consulta_medica_veterinaria",
      visto: false
    }
    
    const docRef = await addDoc(consultasRef, consultaData)
    
    return { exito: true, id: docRef.id }
  } catch (error) {
    console.error("Error al guardar consulta médica:", error)
    return { exito: false, mensaje: error.message }
  }
}

export { auth, db }