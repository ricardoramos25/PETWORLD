# Reglas de Seguridad de Firestore — PetWorld

> **¿Por qué necesitas esto?**  
> El período de prueba de Firestore venció. Las reglas predeterminadas ahora **deniegan todo acceso**. Debes copiar las reglas de abajo en la consola de Firebase para que la app vuelva a funcionar correctamente.

---

## Paso a paso para aplicar las reglas

1. Ve a [https://console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. En el menú izquierdo: **Firestore Database → Reglas**
4. Borra el contenido actual y pega las reglas de abajo
5. Haz clic en **Publicar**

---

## Reglas de Firestore

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // ─────────────────────────────────────────
    // COLECCIÓN: usuarios
    // Campos escritos por el código:
    //   asegurarDocumentoUsuario (Google): uid, nombre, email, foto, telefono,
    //     direccion, ciudad, fechaRegistro, puntos, totalCompras, rol
    //   registrarUsuario (email): id, nombre, email, telefono,
    //     direccion, ciudad, fechaRegistro, puntos, totalCompras
    //   updateDoc (puntos, totalCompras al comprar)
    // ─────────────────────────────────────────
    match /usuarios/{userId} {

      // Solo el propio usuario puede leer su perfil
      allow read: if request.auth != null && request.auth.uid == userId;

      // Crear: el UID del documento debe coincidir con el usuario autenticado
      // y debe incluir los campos mínimos que escribe el código
      allow create: if request.auth != null
                    && request.auth.uid == userId
                    && request.resource.data.keys().hasAll(['nombre', 'email']);

      // Actualizar: solo el propio usuario (puntos, totalCompras, perfil)
      allow update: if request.auth != null && request.auth.uid == userId;

      // Nadie puede eliminar un perfil desde el cliente
      allow delete: if false;
    }

    // ─────────────────────────────────────────
    // COLECCIÓN: pedidos
    // Campos escritos por el código (guardarPedido):
    //   usuarioId, usuarioNombre, usuarioEmail, usuarioTelefono,
    //   usuarioDireccion, usuarioCiudad, productos, total, metodoPago,
    //   fecha, fechaTimestamp, estado, estadoColor
    // ─────────────────────────────────────────
    match /pedidos/{pedidoId} {

      // Solo el dueño del pedido puede leerlo
      allow read: if request.auth != null && resource.data.usuarioId == request.auth.uid;

      // Solo usuarios autenticados pueden crear un pedido
      // El usuarioId del pedido debe coincidir con el UID del usuario
      allow create: if request.auth != null
                    && request.resource.data.usuarioId == request.auth.uid
                    && request.resource.data.keys().hasAll([
                         'usuarioId', 'total', 'estado', 'productos',
                         'metodoPago', 'fecha', 'fechaTimestamp'
                       ]);

      // No se permite editar ni eliminar pedidos desde el cliente
      allow update, delete: if false;
    }

    // ─────────────────────────────────────────
    // COLECCIÓN: consultasMedicas
    // Campos escritos por el código (guardarConsultaMedica):
    //   usuarioId, nombreUsuario, emailUsuario, fecha, tipo, visto
    // ─────────────────────────────────────────
    match /consultasMedicas/{consultaId} {

      // Solo el usuario que creó la consulta puede leerla
      allow read: if request.auth != null && resource.data.usuarioId == request.auth.uid;

      // Solo usuarios autenticados pueden crear una consulta
      allow create: if request.auth != null
                    && request.resource.data.usuarioId == request.auth.uid
                    && request.resource.data.keys().hasAll([
                         'usuarioId', 'nombreUsuario', 'emailUsuario',
                         'fecha', 'tipo', 'visto'
                       ]);

      // No se permite editar ni eliminar desde el cliente
      allow update, delete: if false;
    }

  }
}
```

---

## ¿Qué protegen estas reglas?

| Colección | Leer | Crear | Editar | Eliminar |
|---|---|---|---|---|
| `usuarios` | Solo el propio usuario ✅ | Solo el propio usuario con campos válidos ✅ | Solo el propio usuario ✅ | Nadie ❌ |
| `pedidos` | Solo el dueño del pedido ✅ | Solo el usuario autenticado, con su UID ✅ | Nadie ❌ | Nadie ❌ |
| `consultasMedicas` | Solo el creador ✅ | Solo el usuario autenticado, con su UID ✅ | Nadie ❌ | Nadie ❌ |

---

## Notas importantes

- **Rol `admin`**: Si en el futuro necesitas un panel de administración, deberás agregar una regla especial que valide `request.auth.token.admin == true` (usando Firebase Custom Claims) o verificar el campo `rol` del documento del usuario *solo desde Cloud Functions*, nunca desde el cliente.
- **Google Sign-In**: Los usuarios que inician sesión con Google también son cubiertos por estas reglas, ya que Firebase Auth les asigna un `uid` igual.
- **Índices requeridos**: Firestore puede pedirte crear índices compuestos para las consultas con `where` + `orderBy`. Si la app lanza un error con un enlace en la consola, haz clic en ese enlace para crear el índice automáticamente.

---

## Verificar que las reglas funcionan

Desde la consola de Firebase puedes usar el **Simulador de reglas** (botón junto a "Publicar") para probar casos:

- ✅ Usuario autenticado leyendo su propio perfil → debe permitirse
- ❌ Usuario autenticado leyendo el perfil de otro → debe denegarse
- ❌ Usuario no autenticado creando un pedido → debe denegarse
