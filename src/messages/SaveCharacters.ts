export interface SavedCharacter {
  id: string;
  name: string;
  world: string;
  retainers: {
    [key: string]: {
      id: string;
      name: string;
    };
  };
  loadDateTime: number;
}

export interface SaveCharactersMessage {
  method: 'Nunze_saveCharacters';
  characters: SavedCharacter[];
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
