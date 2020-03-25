export interface InventoryItem {
  name: string;
  number: number;
  HQ: boolean;
  collectable: boolean;
}

export interface InventoryData {
  characterId: string;
  retainerId: string;
  loadDateTime: number;
  items: InventoryItem[];
}

export interface InventoryStorageData {
  version: number;
  data: InventoryData;
}

export const DEFAULT_INVENTORIES: InventoryStorageData = {
  version: 1,
  data: {
    characterId: '',
    retainerId: '',
    loadDateTime: -1,
    items: [],
  },
};
