import { Message, MessageNames, isExtractDomSuccess, isExtractDomFailure } from '../messages'

const TIMEOUT_MS = 60 * 1000

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

  const responsePromise = chrome.runtime.sendMessage<Message, Message>(message)
  const timeoutPromise = new Promise<Message>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout: failed to receive response within ${TIMEOUT_MS / 1000} seconds`))
    }, TIMEOUT_MS)
  })

  const response = await Promise.race([responsePromise, timeoutPromise])

  console.log('got response', response)

  if (isExtractDomSuccess(response)) {
    return response.payload.content
  }

  if (isExtractDomFailure(response)) {
    throw new Error('failed to extract dom content')
  }

  throw new Error('invalid response received')
}
