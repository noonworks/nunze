export interface GetSelectionMessage {
  method: 'Nunze_getSelection';
}

export interface GetSelectionResponse {
  method: 'Nunze_getSelection';
  selection: string;
}

export function isGetSelectionResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is GetSelectionResponse {
  return response.method === 'Nunze_getSelection';
}
