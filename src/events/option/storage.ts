import { CacheLocalStorage } from '../storage/CacheLocalStorage';
import { NunzeOptionBase } from './option';
import { DEFAULT_OPTIONS } from '.';
import { Version1 } from './version1';
import { migrate1to2 } from './version2';

const NUNZE_OPTION_KEY = 'nunze_option';

export type SaveCallback = () => void;

export class OptionStorage extends CacheLocalStorage<NunzeOptionBase> {
  private static ins: OptionStorage;

  static instance(): OptionStorage {
    if (!this.ins) this.ins = new OptionStorage();
    return this.ins;
  }

  private saveCallback: SaveCallback | null = null;

  private constructor() {
    super(NUNZE_OPTION_KEY, DEFAULT_OPTIONS);
  }

  public setSaveCallback(cb: SaveCallback | null): void {
    this.saveCallback = cb;
  }

  public save(opt: NunzeOptionBase): void {
    super.save(opt);
    if (this.saveCallback) this.saveCallback();
  }

  public migrate(data: NunzeOptionBase): NunzeOptionBase {
    if (data.version === 1) return migrate1to2(data as Version1);
    return data;
  }
}
