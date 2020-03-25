const ALL_CONTEXTS = [
  'page',
  'frame',
  'selection',
  'link',
  'editable',
  'image',
  'video',
  'audio',
] as const;
export type Contexts = typeof ALL_CONTEXTS[number];

export interface MenuItemOption extends chrome.contextMenus.CreateProperties {
  contexts?: Contexts[];
}

export class MenuItem {
  private opt: chrome.contextMenus.CreateProperties;

  constructor(opt: MenuItemOption) {
    const contexts: Contexts[] = opt.contexts
      ? opt.contexts
      : [...ALL_CONTEXTS];
    this.opt = {
      ...opt,
      contexts,
    };
  }

  public get id(): string {
    return this.opt.id || '';
  }

  public get title(): string {
    return this.opt.title || '';
  }

  public create(): void {
    chrome.contextMenus.create(this.opt);
  }

  public remove(): void {
    chrome.contextMenus.remove(this.id);
  }

  public updateTitle(title: string): void {
    if (this.opt.title == title) return;
    this.opt.title = title;
    chrome.contextMenus.update(this.id, { title: this.opt.title });
  }
}
