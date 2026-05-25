import { useState } from "react"

const getInitials = (usuario) => {
  const base = usuario?.nombre || usuario?.email || "Usuario"
  const parts = base
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  return parts.map((part) => part[0]?.toUpperCase() || "").join("") || "U"
}

const getFallbackAvatar = (usuario) => {
  const initials = getInitials(usuario)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" role="img" aria-label="Avatar del usuario">
      <defs>
        <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2563eb" />
          <stop offset="100%" stop-color="#1d4ed8" />
        </linearGradient>
      </defs>
      <rect width="128" height="128" rx="64" fill="url(#avatarGradient)" />
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Arial, sans-serif" font-size="46" font-weight="700" fill="#ffffff">${initials}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function UserAvatar({ usuario, alt, className }) {
  const [imageError, setImageError] = useState(false)

  const fallbackAvatar = getFallbackAvatar(usuario)
  const source = !imageError && usuario?.foto ? usuario.foto : fallbackAvatar

  return (
    <img
      key={usuario?.foto || "fallback-avatar"}
      src={source}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      referrerPolicy="no-referrer"
    />
  )
}

export default UserAvatar