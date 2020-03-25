import { CacheLocalStorage } from './CacheLocalStorage';

const DEBOUNCE_SAVE_CACHE_STORAGE_INTERVAL = 500;

export abstract class DebounceSaveCacheStorage<T> extends CacheLocalStorage<T> {
  private saveTimer: NodeJS.Timeout | null = null;

  constructor(key: string, defaultData: T) {
    super(key, defaultData);
  }

  public save(data: T): void {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.doDebounceSave(data);
    }, DEBOUNCE_SAVE_CACHE_STORAGE_INTERVAL);
  }

  private doDebounceSave(data: T): void {
    super.save(data);
  }
}
