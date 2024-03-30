export const extractDomContent = async (url: string): Promise<string> => {
  // Create a new tab without activating it
  const tab = await chrome.tabs.create({ active: false, url })

  if (!tab.id) {
    throw new Error('Tab id not found')
  }

  return new Promise<string>(async (resolve) => {
    // Listener for tab updates
    const tabUpdateListener = async (
      updatedTabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
    ) => {
      const hasTabFinishedLoading = changeInfo.status === 'complete'
      if (updatedTabId === tab.id && hasTabFinishedLoading) {
        // Remove the listener once the tab is loaded
        chrome.tabs.onUpdated.removeListener(tabUpdateListener)

        // Execute script to get DOM content
        const extractDomContent = () => {
          chrome.runtime.sendMessage({ method: 'dom', data: document.body.innerHTML })
        }

        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: extractDomContent,
        })

        chrome.tabs.remove(tab.id!, () => {})
      }
    }

    // Listener for runtime messages
    const messageListener = (
      msg: { method: string; data: string },
      sender: chrome.runtime.MessageSender,
    ) => {
      if (msg.method === 'dom' && sender?.tab?.id === tab.id) {
        // Remove the listener once the message is received
        chrome.runtime.onMessage.removeListener(messageListener)
        resolve(msg.data)
      }
    }

    // Add listeners
    chrome.tabs.onUpdated.addListener(tabUpdateListener)
    chrome.runtime.onMessage.addListener(messageListener)
  })
}
