import { useState, useEffect } from 'react'
import BuildTab from './components/BuildTab.jsx'
import CustomTab from './components/CustomTab.jsx'
import ConfigModal from './components/ConfigModal.jsx'
import './App.css'

const STORAGE_KEY = 'qrGeneratorState'
const TAB_KEY = 'qrGeneratorActiveTab'

const defaultState = {
  schemaConfig: null,
  schemaValue: '',
  deeplinkBaseConfig: null,
  deeplinkBaseValue: '',
  urlParam: '',
  dynamicParams: [],
  customInputValue: '',
}

function loadFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState
  } catch {
    return defaultState
  }
}

function loadActiveTab() {
  return localStorage.getItem(TAB_KEY) || 'build'
}

export default function App() {
  const [activeTab, setActiveTab] = useState(loadActiveTab)
  const [state, setState] = useState(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(TAB_KEY, activeTab)
  }, [activeTab])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function updateState(partial) {
    setState(prev => ({ ...prev, ...partial }))
  }

  function applyConfig(json) {
    if (json === null) {
      updateState({
        schemaConfig: null,
        schemaValue: '',
        deeplinkBaseConfig: null,
        deeplinkBaseValue: '',
        urlParam: '',
        dynamicParams: [],
      })
      return
    }

    const updates = {}

    if (json.schema !== undefined) {
      if (Array.isArray(json.schema)) {
        updates.schemaConfig = json.schema
        updates.schemaValue = json.schema[0] ?? ''
      } else {
        updates.schemaConfig = null
        updates.schemaValue = String(json.schema)
      }
    }

    if (json.deeplink_base !== undefined) {
      if (Array.isArray(json.deeplink_base)) {
        updates.deeplinkBaseConfig = json.deeplink_base
        updates.deeplinkBaseValue = json.deeplink_base[0] ?? ''
      } else {
        updates.deeplinkBaseConfig = null
        updates.deeplinkBaseValue = String(json.deeplink_base)
      }
    }

    if (Array.isArray(json.query_params)) {
      const urlEntry = json.query_params.find(p => p.key === 'url')
      const others = json.query_params.filter(p => p.key !== 'url')
      if (urlEntry !== undefined) updates.urlParam = urlEntry.value ?? ''
      updates.dynamicParams = others.map(p => ({ key: p.key ?? '', value: p.value ?? '' }))
    }

    updateState(updates)
  }

  return (
    <>
      <div className="app-card">
        <header className="app-header">
          <div className="app-header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="17" width="3" height="3" rx="0.5" />
              <rect x="19" y="14" width="2" height="2" rx="0.5" />
              <rect x="19" y="19" width="2" height="2" rx="0.5" />
              <rect x="14" y="14" width="2" height="2" rx="0.5" />
            </svg>
          </div>
          <h1 className="app-title">QR Deeplink Generator</h1>
        </header>

        <div className="tab-bar">
          <button
            className={`tab-btn ${activeTab === 'build' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('build')}
          >
            Build Deeplink
          </button>
          <button
            className={`tab-btn ${activeTab === 'custom' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            Custom
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'build' ? (
            <BuildTab state={state} updateState={updateState} />
          ) : (
            <CustomTab
              value={state.customInputValue}
              onChange={val => updateState({ customInputValue: val })}
            />
          )}
        </div>
      </div>

      <ConfigModal onApply={applyConfig} />
    </>
  )
}
