export interface DeleteLodestoneDataMessage {
  method: 'Nunze_deleteLodestoneData';
}

export interface DeleteLodestoneDataResponse {
  method: 'Nunze_deleteLodestoneData';
  succeed: boolean;
}

export function isDeleteLodestoneResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is DeleteLodestoneDataResponse {
  return response.method === 'Nunze_deleteLodestoneData';
}
