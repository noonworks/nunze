import { CacheLocalStorage } from '../../storage/CacheLocalStorage';
import {
  CharacterStorageData,
  DEFAULT_CHARACTERS,
  CharacterStorageDataData,
} from './data';

class CharacterStorage extends CacheLocalStorage<CharacterStorageData> {}

const CHARACTER_ID_FC = 'FREECOMPANY';

export class CharacterStore {
  static ins: CharacterStore;

  static instance(): CharacterStore {
    if (!this.ins) this.ins = new CharacterStore();
    return this.ins;
  }

  private storage: CharacterStorage;

  private constructor() {
    this.storage = new CharacterStorage(
      'nunze_ls_characters',
      DEFAULT_CHARACTERS
    );
  }

  public saveCharacters(characters: CharacterStorageDataData[]): void {
    const charData = this.storage.load();
    for (let i = 0; i < characters.length; i++) {
      charData.data[characters[i].id] = characters[i];
    }
    return this.storage.save(charData);
  }

  public saveFreeCompany(fc: {
    id: string;
    name: string;
    world: string;
    loadDateTime: number;
  }): void {
    const charData = this.storage.load();
    const charIds = Object.keys(charData.data);
    if (charIds.indexOf(CHARACTER_ID_FC) < 0) {
      charData.data[CHARACTER_ID_FC] = {
        id: CHARACTER_ID_FC,
        name: 'フリーカンパニー',
        world: fc.world,
        loadDateTime: fc.loadDateTime,
        retainers: {},
      };
    }
    charData.data[CHARACTER_ID_FC].retainers[fc.id] = {
      id: fc.id,
      name: fc.name,
    };
    return this.storage.save(charData);
  }
}
