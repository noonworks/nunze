import { StorageCollection } from '../../storage/StorageCollection';
import {
  InventoryStorageData,
  DEFAULT_INVENTORIES,
  InventoryData,
} from './data';
import { MigratableLocalStorage } from '../../storage/MigratableLocalStorage';

class InventoryStorage extends MigratableLocalStorage<InventoryStorageData> {}

export class Inventory {
  static ins: Inventory;

  static instance(): Inventory {
    if (!this.ins) this.ins = new Inventory();
    return this.ins;
  }

  private storage: StorageCollection<InventoryStorageData, InventoryStorage>;

  private constructor() {
    this.storage = new StorageCollection(
      'nunze_ls_inventories',
      { ...DEFAULT_INVENTORIES },
      InventoryStorage
    );
  }

  public loadAll(): InventoryData[] {
    return this.storage.loadAll().map((i) => i.data);
  }

  public removeAll(): void {
    this.storage.removeAll();
  }

  public save(inventories: InventoryData[]): void {
    for (let i = 0; i < inventories.length; i++) {
      if (
        !inventories[i].characterId ||
        inventories[i].characterId.length == 0 ||
        !inventories[i].retainerId ||
        inventories[i].retainerId.length == 0
      )
        continue;
      const subKey =
        inventories[i].characterId + '_' + inventories[i].retainerId;
      const inv = this.storage.load(subKey);
      inv.data = inventories[i];
      this.storage.save(subKey, inv);
    }
  }
}
