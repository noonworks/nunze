export interface UpdateSearchMenuMessage {
  method: 'Nunze_updateSearchMenu';
  name: string;
}

export interface UpdateSearchMenuResponse {
  method: 'Nunze_updateSearchMenu';
  succeed: boolean;
}

export function isUpdateSearchMenuResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is UpdateSearchMenuResponse {
  return response.method === 'Nunze_updateSearchMenu';
}
