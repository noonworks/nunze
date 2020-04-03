import { LogItem } from '../../../content_scripts/lodestone/loadShop';

export interface LogData {
  characterId: string;
  retainerId: string;
  loadDateTime: number;
  items: LogItem[];
}

export interface LogStorageData {
  version: number;
  data: LogData;
}

export const DEFAULT_LOGS: LogStorageData = {
  version: 1,
  data: {
    characterId: '',
    retainerId: '',
    loadDateTime: -1,
    items: [],
  },
};
