import { validateQRCodeContent } from './deeplinkValidation.js'

function normalizeStoredString(value) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
}

function sanitizeStoredContent(value) {
  const normalized = normalizeStoredString(value)

  if (!normalized.trim()) {
    return ''
  }

  try {
    return validateQRCodeContent(normalized).value
  } catch {
    return ''
  }
}

function sanitizeOptionList(value) {
  if (!Array.isArray(value)) {
    return null
  }

  return value.map(option => normalizeStoredString(option))
}

function sanitizeDynamicParams(value) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map(param => ({
    key: normalizeStoredString(param?.key),
    value: normalizeStoredString(param?.value),
  }))
}

export function sanitizePersistedState(state) {
  return {
    schemaConfig: sanitizeOptionList(state?.schemaConfig),
    schemaValue: normalizeStoredString(state?.schemaValue),
    deeplinkBaseConfig: sanitizeOptionList(state?.deeplinkBaseConfig),
    deeplinkBaseValue: normalizeStoredString(state?.deeplinkBaseValue),
    urlParam: sanitizeStoredContent(state?.urlParam),
    dynamicParams: sanitizeDynamicParams(state?.dynamicParams),
    customInputValue: sanitizeStoredContent(state?.customInputValue),
  }
}
