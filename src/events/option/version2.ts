import { NunzeOptionBase } from './option';
import { Version1 } from './version1';

export interface Version2 extends NunzeOptionBase {
  version: 2;
  data: {
    lodestone: {
      use: boolean;
      expireDate: number;
      part: boolean;
      strictAndPart: boolean;
      fuzzy: boolean;
      strictAndFuzzy: boolean;
    };
    search: {
      sites: {
        use: boolean;
        name: string;
        url: string;
      }[];
    };
    mouseover: {
      use: boolean;
      historyMax: number;
    };
  };
}

export function migrate1to2(opt: Version1): Version2 {
  return {
    version: 2,
    data: {
      lodestone: {
        ...opt.data.loadstone,
      },
      search: {
        ...opt.data.search,
      },
      mouseover: {
        ...opt.data.mouseover,
      },
    },
  } as Version2;
}
