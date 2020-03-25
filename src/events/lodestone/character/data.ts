export interface CharacterStorageDataData {
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

export interface CharacterStorageData {
  version: number;
  data: {
    [key: string]: CharacterStorageDataData;
  };
}

export const DEFAULT_CHARACTERS: CharacterStorageData = {
  version: 1,
  data: {},
};
