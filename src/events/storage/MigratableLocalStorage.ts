export abstract class MigratableLocalStorage<T> {
  private key: string;
  protected defaultData: T;

  constructor(key: string, defaultData: T) {
    this.key = key;
    this.defaultData = defaultData;
  }

  // Migrate and Save data
  public save(data: T): void {
    this.doSave(data);
  }

  protected doSave(data: T): T {
    data = this.migrate(data);
    localStorage.setItem(this.key, JSON.stringify(data));
    return data;
  }

  // Load and Migrate data
  public load(): T {
    let str = localStorage.getItem(this.key);
    if (!str) {
      str = JSON.stringify(this.defaultData);
      localStorage.setItem(this.key, str);
    }
    return this.migrate(JSON.parse(str));
  }

  // Reset data
  public reset(): T {
    this.save(this.defaultData);
    return this.load();
  }

  // Remove data
  public remove(): void {
    localStorage.removeItem(this.key);
  }

  // Migrate
  public migrate(data: T): T {
    return data;
  }
}
