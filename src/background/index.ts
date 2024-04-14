import { Message, MessageNames, isExtractDomRequest } from '@/lib/messages'

const openTabs: Set<number> = new Set()

chrome.runtime.onConnect.addListener(async function (port) {
  if (port.name === 'popup') {
    port.onDisconnect.addListener(function () {
      for (const tabId of openTabs) {
        try {
          chrome.tabs.remove(tabId, () => {})
        } catch (err) {
          console.error('failed to remove tab', tabId)
        }
      }
    })
  }
})

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (isExtractDomRequest(msg)) {
    extractDomContent(msg.payload.url)
      .then((data) => {
        const message: Message = {
          type: MessageNames.EXTRACT_DOM_SUCCESS,
          payload: {
            url: msg.payload.url,
            content: data,
          },
        }
        sendResponse(message)
      })
      .catch((error) => {
        const message: Message = {
          type: MessageNames.EXTRACT_DOM_FAILURE,
          payload: {
            url: msg.payload.url,
            error: error.message,
          },
        }
        sendResponse(message)
      })

    return true
  }
})

export const extractDomContent = async (url: string): Promise<string> => {
  // Create a new tab without activating it
  const tab = await chrome.tabs.create({ active: false, url })

  if (!tab.id) {
    throw new Error('Tab id not found')
  }

  openTabs.add(tab.id)

  return new Promise<string>(async (resolve, reject) => {
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
          chrome.runtime.sendMessage({
            method: 'dom',
            data: document.body.innerHTML,
          })
        }

        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: extractDomContent,
          })
        } catch (err) {
          reject(new Error('failed to execute script'))
        } finally {
          chrome.tabs.remove(tab.id!, () => {})
          openTabs.delete(tab.id)
        }
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
