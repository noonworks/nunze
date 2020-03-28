export interface SavedFC {
  id: string;
  name: string;
  world: string;
  loadDateTime: number;
}

export interface SaveFreeCompanyMessage {
  method: 'Nunze_saveFreeCompany';
  fc: SavedFC;
}

export interface SaveFreeCompanyResponse {
  method: 'Nunze_saveFreeCompany';
  succeed: boolean;
}

export function isSaveFreeCompanyResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is SaveFreeCompanyResponse {
  return response.method === 'Nunze_saveFreeCompany';
}
