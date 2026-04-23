import { useState } from 'react'
import QueryParams from './QueryParams.jsx'
import QROutput from './QROutput.jsx'
import { validateDeeplinkURL } from '../utils/deeplinkValidation.js'
import './BuildTab.css'

export default function BuildTab({ state, updateState }) {
  const [generatedDeeplink, setGeneratedDeeplink] = useState(null)
  const [error, setError] = useState(null)
  const [warning, setWarning] = useState(null)

  function buildDeeplink() {
    setError(null)
    setWarning(null)
    setGeneratedDeeplink(null)

    const schema = state.schemaValue.trim()
    const base = state.deeplinkBaseValue.trim()

    if (!schema) { setError('Enter a schema.'); return }
    if (!base) { setError('Enter a base deeplink.'); return }

    const params = []

    if (state.urlParam.trim()) {
      params.push(`url=${encodeURIComponent(state.urlParam.trim())}`)
    }

    state.dynamicParams.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) {
        params.push(`${encodeURIComponent(key.trim())}=${encodeURIComponent(value.trim())}`)
      }
    })

    const queryString = params.length > 0 ? `?${params.join('&')}` : ''

    try {
      const validatedDeeplink = validateDeeplinkURL(`${schema}://${base}${queryString}`)
      setGeneratedDeeplink(validatedDeeplink.value)
      setWarning(validatedDeeplink.warning)
    } catch (validationError) {
      setError(validationError.message)
    }
  }

  return (
    <div className="build-tab">
      <div className="form-group">
        <label className="form-label">Schema</label>
        {Array.isArray(state.schemaConfig) ? (
          <select
            className="form-select"
            value={state.schemaValue}
            onChange={e => updateState({ schemaValue: e.target.value })}
          >
            {state.schemaConfig.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <div className="input-wrapper">
            <input
              type="text"
              className="form-input"
              placeholder="e.g., chrome"
              value={state.schemaValue}
              onChange={e => updateState({ schemaValue: e.target.value })}
            />
            {state.schemaValue && (
              <button type="button" className="input-clear-btn" onClick={() => updateState({ schemaValue: '' })} title="Clear">×</button>
            )}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Deeplink base</label>
        {Array.isArray(state.deeplinkBaseConfig) ? (
          <select
            className="form-select"
            value={state.deeplinkBaseValue}
            onChange={e => updateState({ deeplinkBaseValue: e.target.value })}
          >
            {state.deeplinkBaseConfig.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <div className="input-wrapper">
            <input
              type="text"
              className="form-input"
              placeholder="e.g., inspect/#devices"
              value={state.deeplinkBaseValue}
              onChange={e => updateState({ deeplinkBaseValue: e.target.value })}
            />
            {state.deeplinkBaseValue && (
              <button type="button" className="input-clear-btn" onClick={() => updateState({ deeplinkBaseValue: '' })} title="Clear">×</button>
            )}
          </div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Query Params</label>
        <QueryParams
          urlParam={state.urlParam}
          dynamicParams={state.dynamicParams}
          onUrlChange={urlParam => updateState({ urlParam })}
          onDynamicChange={dynamicParams => updateState({ dynamicParams })}
        />
      </div>

      <button className="build-btn" onClick={buildDeeplink}>
        Generate QR code
      </button>

      <QROutput deeplink={generatedDeeplink} error={error} warning={warning} />
    </div>
  )
}
