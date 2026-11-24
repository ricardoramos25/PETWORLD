# Pasos para configurar variables en Vercel (Manual)

## Método 1: Dashboard de Vercel (Más fácil)

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto **petworld-pearl**
3. Ve a **Settings** (esquina superior derecha)
4. En el menú izquierdo, haz clic en **Environment Variables**
5. Agrega estas variables (copia exactamente):

### VITE_FIREBASE_API_KEY
```
AIzaSyB6I5m11_-nZJxx4AEqXZAmM6mPRSSH0Cg
```

### VITE_FIREBASE_AUTH_DOMAIN
```
petworld-94eb4.firebaseapp.com
```

### VITE_FIREBASE_PROJECT_ID
```
petworld-94eb4
```

### VITE_FIREBASE_STORAGE_BUCKET
```
petworld-94eb4.firebasestorage.app
```

### VITE_FIREBASE_MESSAGING_SENDER_ID
```
1056118883413
```

### VITE_FIREBASE_APP_ID
```
1:1056118883413:web:08a8dc82053afb713700dc
```

### VITE_WHATSAPP_ADMIN_NUMBER
```
50499288926
```

6. Para cada variable:
   - Pega el nombre en **Key**
   - Pega el valor en **Value**
   - Asegúrate de seleccionar: ✅ Production, ✅ Preview, ✅ Development
   - Haz clic en **Save**

7. Espera a que aparezca un botón **Redeploy** en azul
8. Haz clic en **Redeploy** para volver a deployar con las nuevas variables
9. Espera 1-2 minutos a que complete

---

## Método 2: CLI de Vercel (Línea de comandos)

Una vez que completes el login en el terminal, ejecuta:

```powershell
cd c:\Users\DELL\petworld
vercel env add VITE_FIREBASE_API_KEY
# Te pedirá que pegues el valor: AIzaSyB6I5m11_-nZJxx4AEqXZAmM6mPRSSH0Cg

vercel env add VITE_FIREBASE_AUTH_DOMAIN
# petworld-94eb4.firebaseapp.com

vercel env add VITE_FIREBASE_PROJECT_ID
# petworld-94eb4

vercel env add VITE_FIREBASE_STORAGE_BUCKET
# petworld-94eb4.firebasestorage.app

vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
# 1056118883413

vercel env add VITE_FIREBASE_APP_ID
# 1:1056118883413:web:08a8dc82053afb713700dc

vercel env add VITE_WHATSAPP_ADMIN_NUMBER
# 50499288926

vercel redeploy --prod
```

---

## ¿Cuál elegir?

- **Dashboard (Método 1):** Más visual, menos propenso a errores
- **CLI (Método 2):** Más rápido si ya tienes todo a la mano
