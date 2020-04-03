import { StorageCollection } from '../../storage/StorageCollection';
import { LogStorageData, DEFAULT_LOGS, LogData } from './data';
import { MigratableLocalStorage } from '../../storage/MigratableLocalStorage';

class LogStorage extends MigratableLocalStorage<LogStorageData> {}

export class LogStore {
  static ins: LogStore;

  static instance(): LogStore {
    if (!this.ins) this.ins = new LogStore();
    return this.ins;
  }

  private storage: StorageCollection<LogStorageData, LogStorage>;

  private constructor() {
    this.storage = new StorageCollection(
      'nunze_ls_log',
      { ...DEFAULT_LOGS },
      LogStorage
    );
  }

  public loadAll(): LogData[] {
    return this.storage.loadAll().map((i) => i.data);
  }

  public removeAll(): void {
    this.storage.removeAll();
  }

  public save(logs: LogData[]): void {
    for (let i = 0; i < logs.length; i++) {
      if (
        !logs[i].characterId ||
        logs[i].characterId.length == 0 ||
        !logs[i].retainerId ||
        logs[i].retainerId.length == 0
      )
        continue;
      const subKey = logs[i].characterId + '_' + logs[i].retainerId;
      const inv = this.storage.load(subKey);
      inv.data = logs[i];
      this.storage.save(subKey, inv);
    }
  }
}
