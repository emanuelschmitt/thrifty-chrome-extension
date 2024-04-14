export enum MessageNames {
  EXTRACT_DOM_REQUEST = 'EXTRACT_DOM_REQUEST',
  EXTRACT_DOM_SUCCESS = 'EXTRACT_DOM_SUCCESS',
  EXTRACT_DOM_FAILURE = 'EXTRACT_DOM_FAILURE',
}

export type ExtractDomRequestMessage = {
  type: MessageNames.EXTRACT_DOM_REQUEST
  payload: { url: string }
}

export type ExtractDomSuccessMessage = {
  type: MessageNames.EXTRACT_DOM_SUCCESS
  payload: { url: string; content: string }
}

export type ExtractDomFailureMessage = {
  type: MessageNames.EXTRACT_DOM_FAILURE
  payload: { url: string; error: string }
}

export type Message = ExtractDomRequestMessage | ExtractDomSuccessMessage | ExtractDomFailureMessage

export function isExtractDomRequest(msg: unknown): msg is ExtractDomRequestMessage {
  if (!(typeof msg === 'object')) {
    return false
  }
  if (!msg) {
    return false
  }
  return 'type' in msg && msg?.type === MessageNames.EXTRACT_DOM_REQUEST
}

export function isExtractDomSuccess(msg: unknown): msg is ExtractDomSuccessMessage {
  if (!(typeof msg === 'object')) {
    return false
  }
  if (!msg) {
    return false
  }
  return 'type' in msg && msg?.type === MessageNames.EXTRACT_DOM_SUCCESS
}

export function isExtractDomFailure(msg: unknown): msg is ExtractDomFailureMessage {
  if (!(typeof msg === 'object')) {
    return false
  }
  if (!msg) {
    return false
  }
  return 'type' in msg && msg?.type === MessageNames.EXTRACT_DOM_FAILURE
}
