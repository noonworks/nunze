import { MigratableLocalStorage } from './MigratableLocalStorage';

export abstract class CacheLocalStorage<T> extends MigratableLocalStorage<T> {
  private cache: T | null;

  constructor(key: string, defaultData: T) {
    super(key, defaultData);
    this.cache = null;
  }

  // Save and Cache data
  public save(data: T): void {
    this.cache = super.doSave(data);
  }

  // Load and Cache data
  public load(reload?: boolean): T {
    if (reload || !this.cache) this.cache = super.load();
    return this.cache as T;
  }

  // Reset and Cache data
  public reset(): T {
    this.save(this.defaultData);
    this.cache = super.load();
    return this.cache;
  }

  // Clear cache
  public clearCache(): void {
    this.cache = null;
  }
}
