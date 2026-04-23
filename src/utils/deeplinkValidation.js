const ALLOWED_SCHEMES = ['http:', 'https:', 'meli:', 'mercadolibre:', 'mercadopago:']
const BLOCKED_SCHEMES = ['javascript:', 'data:', 'vbscript:', 'file:']

function buildInvalidSchemeError(protocol) {
  return new Error(`Unsupported URL scheme: ${protocol}`)
}

function buildUnknownSchemeWarning(protocol) {
  return `Warning: ${protocol} is not a schema recognized by this app.`
}

export function validateDeeplinkURL(raw) {
  let url

  try {
    url = new URL(raw)
  } catch {
    throw new Error('Invalid URL format.')
  }

  if (BLOCKED_SCHEMES.includes(url.protocol)) {
    throw buildInvalidSchemeError(url.protocol)
  }

  return {
    value: url.toString(),
    warning: ALLOWED_SCHEMES.includes(url.protocol)
      ? null
      : buildUnknownSchemeWarning(url.protocol),
  }
}

export function validateQRCodeContent(raw) {
  const trimmed = raw.trim()

  if (!trimmed) {
    throw new Error('Enter text or URL.')
  }

  try {
    return validateDeeplinkURL(trimmed)
  } catch (error) {
    if (error.message === 'Invalid URL format.') {
      return {
        value: trimmed,
        warning: null,
      }
    }

    throw error
  }
}

export { ALLOWED_SCHEMES, BLOCKED_SCHEMES }
