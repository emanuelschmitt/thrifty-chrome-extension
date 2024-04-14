import { extractDomContent } from '@/lib/dom'
import { Message, MessageNames, isExtractDomRequest } from '@/lib/messages'

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (isExtractDomRequest(msg)) {
    extractDomContent(msg.payload.url)
      .then((data) => {
        const message: Message = {
          type: MessageNames.EXTRACT_DOM_SUCCESS,
          payload: {
            content: data,
          },
        }
        sendResponse(message)
      })
      .catch((error) => {
        const message: Message = {
          type: MessageNames.EXTRACT_DOM_FAILURE,
          payload: {
            error: error.message,
          },
        }
        sendResponse(message)
      })

    return true
  }
})
