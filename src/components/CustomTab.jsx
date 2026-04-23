import { useState } from 'react'
import QROutput from './QROutput.jsx'
import { validateQRCodeContent } from '../utils/deeplinkValidation.js'
import './CustomTab.css'

export default function CustomTab({ value, onChange }) {
  const [generatedText, setGeneratedText] = useState(null)
  const [error, setError] = useState(null)
  const [warning, setWarning] = useState(null)

  function handleGenerate() {
    setError(null)
    setWarning(null)
    setGeneratedText(null)

    try {
      const validatedContent = validateQRCodeContent(value)
      setGeneratedText(validatedContent.value)
      setWarning(validatedContent.warning)
    } catch (validationError) {
      setError(validationError.message)
    }
  }

  return (
    <div className="custom-tab">
      <div className="form-group">
        <label className="form-label">Text or URL</label>
        <textarea
          className="custom-textarea"
          rows={4}
          placeholder="Enter text, URL, or any content for the QR code."
          value={value}
          onChange={e => onChange(e.target.value)}
        />
      </div>

      <button className="build-btn" onClick={handleGenerate}>
        Generate QR code
      </button>

      <QROutput deeplink={generatedText} error={error} warning={warning} />
    </div>
  )
}
