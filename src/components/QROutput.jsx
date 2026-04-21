import './QROutput.css'

export default function QROutput({ deeplink, error }) {
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
          className="qr-image"
          width={200}
          height={200}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        <p className="qr-image-fallback" style={{ display: 'none' }}>
          No se pudo generar el QR. Verificá tu conexión.
        </p>
      </div>
    </div>
  )
}
