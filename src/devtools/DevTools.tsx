import { useEffect, useState } from 'react'
import './DevTools.css'

export const DevTools = () => {
  const [_, setStorage] = useState<string | null>(null)
  useEffect(() => {
    chrome.storage.local.get(null, (result) => {
      setStorage(JSON.stringify(result, null, 2))
    })
  })

  const onDeleteStorage = () => {
    chrome.storage.local.clear(() => {
      setStorage(null)
    })
  }

  return (
    <main>
      <h3>DevTools Page</h3>
      <h3>Storage</h3>
      <button onClick={onDeleteStorage}>Delete Storage</button>
    </main>
  )
}

export default DevTools
