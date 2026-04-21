import { useState } from 'react'
import './ConfigModal.css'

const PLACEHOLDER = `{
  "schema": ["chrome", "other"],
  "deeplink_base": ["inspect/#devices", "other/path"],
  "query_params": [
    { "key": "url", "value": "" },
    { "key": "user_id", "value": "123456" }
  ]
}`

export default function ConfigModal({ onApply }) {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState(null)

  function handleOpen() {
    setError(null)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
    setError(null)
  }

  function handleApply() {
    setError(null)
    if (!text.trim()) {
      onApply(null)
      setOpen(false)
      return
    }

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      setError('JSON inválido. Revisá la sintaxis.')
      return
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      setError('El JSON debe ser un objeto.')
      return
    }

    onApply(parsed)
    setText('')
    setOpen(false)
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) handleClose()
  }

  return (
    <>
      <button className="config-fab" onClick={handleOpen} title="Import settings">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </button>

      {open && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Import settings</h2>
              <button className="modal-close" onClick={handleClose} title="Cerrar">×</button>
            </div>

            <div className="modal-body">
              <p className="modal-hint">
                Paste a JSON object containing the <code>schema</code>, <code>deeplink_base</code> and/or <code>query_params</code> keys.
                A string configures a text field; an array configures a dropdown list.
              </p>
              <textarea
                className="modal-textarea"
                rows={12}
                placeholder={PLACEHOLDER}
                value={text}
                onChange={e => { setText(e.target.value); setError(null) }}
                spellCheck={false}
              />
              {error && <p className="modal-error">{error}</p>}
            </div>

            <div className="modal-footer">
              <button className="modal-btn modal-btn--cancel" onClick={handleClose}>Cancel</button>
              <button className="modal-btn modal-btn--apply" onClick={handleApply}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
