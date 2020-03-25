import { CharacterStorageDataData } from '../events/lodestone/character/data';

export interface SaveCharactersMessage {
  method: 'Nunze_saveCharacters';
  characters: CharacterStorageDataData[];
}

export interface SaveCharactersResponse {
  method: 'Nunze_saveCharacters';
  succeed: boolean;
}

export function isSaveCharactersResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is SaveCharactersResponse {
  return response.method === 'Nunze_saveCharacters';
}
