import { Message, MessageNames, isExtractDomSuccess, isExtractDomFailure } from '../messages'

/**
 * Send a message to the background script to extract the DOM content of a given URL
 * @param url - The URL to extract the DOM content from
 * @returns The extracted DOM content
 */
export const sendDomExtractionRequest = async (url: string): Promise<string> => {
  const message: Message = {
    type: MessageNames.EXTRACT_DOM_REQUEST,
    payload: {
      url,
    },
  }

  const response = await chrome.runtime.sendMessage<Message, Message>(message)

  if (isExtractDomSuccess(response)) {
    return response.payload.content
  }

  if (isExtractDomFailure(response)) {
    throw new Error('failed to extract dom content')
  }

  throw new Error('invalid response received')
}

export const extractDomContent = async (url: string): Promise<string> => {
  // Create a new tab without activating it
  const tab = await chrome.tabs.create({ active: false, url })

  if (!tab.id) {
    throw new Error('Tab id not found')
  }

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
