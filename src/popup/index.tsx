import React from 'react'
import ReactDOM from 'react-dom/client'
import Popup from './Popup'
import './index.css'

chrome.runtime.connect({ name: 'popup' })

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
)
