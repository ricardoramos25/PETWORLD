# Script para configurar variables de entorno en Vercel
# Uso: ./setup-vercel-env.ps1

Write-Host "🚀 Configurando variables de entorno en Vercel..." -ForegroundColor Green

# Variables de Firebase
$env_vars = @{
    "VITE_FIREBASE_API_KEY" = "AIzaSyB6I5m11_-nZJxx4AEqXZAmM6mPRSSH0Cg"
    "VITE_FIREBASE_AUTH_DOMAIN" = "petworld-94eb4.firebaseapp.com"
    "VITE_FIREBASE_PROJECT_ID" = "petworld-94eb4"
    "VITE_FIREBASE_STORAGE_BUCKET" = "petworld-94eb4.firebasestorage.app"
    "VITE_FIREBASE_MESSAGING_SENDER_ID" = "1056118883413"
    "VITE_FIREBASE_APP_ID" = "1:1056118883413:web:08a8dc82053afb713700dc"
    "VITE_WHATSAPP_ADMIN_NUMBER" = "50499288926"
}

# Agregar cada variable a Vercel
foreach ($key in $env_vars.Keys) {
    $value = $env_vars[$key]
    Write-Host "Adding $key..." -ForegroundColor Yellow
    vercel env add $key --yes
    Write-Host "✅ $key added" -ForegroundColor Green
}

Write-Host "`n✨ Todas las variables han sido configuradas en Vercel!" -ForegroundColor Green
Write-Host "Ahora ejecuta: vercel redeploy --prod"
