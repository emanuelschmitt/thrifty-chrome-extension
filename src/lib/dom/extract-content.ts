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
