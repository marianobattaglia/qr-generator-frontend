import './QueryParams.css'

export default function QueryParams({ urlParam, dynamicParams, onUrlChange, onDynamicChange }) {
  function handleDynamicChange(index, field, value) {
    const updated = dynamicParams.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    )
    onDynamicChange(updated)
  }

  function handleDynamicRemove(index) {
    onDynamicChange(dynamicParams.filter((_, i) => i !== index))
  }

  function handleAddParam() {
    onDynamicChange([...dynamicParams, { key: '', value: '' }])
  }

  return (
    <div className="query-params">
      <div className="params-section">
        <div className="param-row">
          <input
            type="text"
            className="param-input param-input--key param-input--readonly"
            value="url"
            readOnly
          />
          <div className="param-value-wrapper">
            <input
              type="text"
              className="param-input param-input--value"
              placeholder="e.g., https://www.google.com/"
              value={urlParam}
              onChange={e => onUrlChange(e.target.value)}
            />
            {urlParam && (
              <button
                type="button"
                className="param-clear-btn"
                onClick={() => onUrlChange('')}
                title="Limpiar"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="params-divider">
        <span>Additional parameters</span>
        <button type="button" className="add-param-btn" onClick={handleAddParam} title="Agregar parámetro">
          +
        </button>
      </div>

      {dynamicParams.length > 0 && (
        <div className="params-section params-section--dynamic">
          {dynamicParams.map((param, index) => (
            <div key={index} className="param-row">
              <div className="param-value-wrapper">
                <input
                  type="text"
                  className="param-input param-input--key"
                  placeholder="key"
                  value={param.key}
                  onChange={e => handleDynamicChange(index, 'key', e.target.value)}
                />
                {param.key && (
                  <button
                    type="button"
                    className="param-clear-btn"
                    onClick={() => handleDynamicChange(index, 'key', '')}
                    title="Limpiar"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="param-value-wrapper">
                <input
                  type="text"
                  className="param-input param-input--value"
                  placeholder="value"
                  value={param.value}
                  onChange={e => handleDynamicChange(index, 'value', e.target.value)}
                />
                {param.value && (
                  <button
                    type="button"
                    className="param-clear-btn"
                    onClick={() => handleDynamicChange(index, 'value', '')}
                    title="Limpiar"
                  >
                    ×
                  </button>
                )}
              </div>
              <button
                type="button"
                className="param-remove-btn"
                onClick={() => handleDynamicRemove(index)}
                title="Eliminar"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
