import { useState } from 'react'
import './QROutput.css'

export default function QROutput({ deeplink, error, warning }) {
  const [hasImageError, setHasImageError] = useState(false)

  if (error) {
    return (
      <div className="qr-output qr-output--error">
        <p className="qr-error-msg">{error}</p>
      </div>
    )
  }

  if (!deeplink) return null

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(deeplink)}`

  return (
    <div className="qr-output">
      <p className="qr-deeplink-text">{deeplink}</p>
      <div className="qr-image-wrapper">
        <img
          src={qrUrl}
          alt="QR Code"
          className={`qr-image ${hasImageError ? 'qr-image--hidden' : ''}`}
          width={200}
          height={200}
          onError={() => setHasImageError(true)}
        />
        <p className={`qr-image-fallback ${hasImageError ? 'qr-image-fallback--visible' : ''}`}>
          No se pudo generar el QR. Verificá tu conexión.
        </p>
      </div>
      {warning && <p className="qr-warning-msg">{warning}</p>}
    </div>
  )
}
