import { MigratableLocalStorage } from './MigratableLocalStorage';

export class StorageCollection<TData, T extends MigratableLocalStorage<TData>> {
  private key: string;
  private defaultData: TData;
  private collection: { [key: string]: T };

  constructor(
    key: string,
    defaultData: TData,
    private dataType: new (key: string, defaultData: TData) => T
  ) {
    this.key = key;
    this.defaultData = defaultData;
    this.collection = {};
  }

  private getSubStorage(subKey: string): T {
    if (Object.keys(this.collection).indexOf(subKey) <= 0) {
      // not found in collection - create storageClass instance
      const st = new this.dataType(this.key + '_' + subKey, this.defaultData);
      this.collection[subKey] = st;
    }
    return this.collection[subKey];
  }

  public save(subKey: string, data: TData): void {
    this.getSubStorage(subKey).save(data);
  }

  public load(subKey: string): TData {
    return this.getSubStorage(subKey).load();
  }

  public loadAll(): TData[] {
    const ret: TData[] = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.indexOf(this.key + '_') == 0) {
        const subKey = key.substring(this.key.length + 1, key.length);
        ret.push(this.getSubStorage(subKey).load());
      }
    });
    return ret;
  }

  public remove(subKey: string): void {
    const subKeys = Object.keys(this.collection);
    if (subKeys.indexOf(subKey) >= 0) {
      this.collection[subKey].remove();
      delete this.collection[subKey];
      return;
    }
    const keys = Object.keys(localStorage);
    const key = this.key + '_' + subKey;
    if (keys.indexOf(key) >= 0) {
      const st = new this.dataType(key, this.defaultData);
      st.remove();
    }
  }

  public removeAll(): void {
    const subKeys = Object.keys(this.collection);
    for (let i = 0; i < subKeys.length; i++) {
      this.collection[subKeys[i]].remove();
      delete this.collection[subKeys[i]];
    }
    Object.keys(localStorage).forEach((key) => {
      if (key.indexOf(this.key + '_') == 0) {
        const st = new this.dataType(key, this.defaultData);
        st.remove();
      }
    });
  }
}
