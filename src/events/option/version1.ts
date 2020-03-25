import { NunzeOptionBase } from './option';

export interface Site {
  use: boolean;
  name: string;
  url: string;
}

export interface Version1 extends NunzeOptionBase {
  version: 1;
  data: {
    loadstone: {
      use: boolean;
      expireDate: number;
      part: boolean;
      strictAndPart: boolean;
      fuzzy: boolean;
      strictAndFuzzy: boolean;
    };
    search: {
      sites: Site[];
    };
    mouseover: {
      use: boolean;
      historyMax: number;
    };
  };
}
