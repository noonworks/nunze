import { NunzeOptionBase } from './option';
import { Version1, Site as SiteV1 } from './version1';

export type Site = SiteV1;

export interface LodeStone {
  use: boolean;
  expireDate: number;
  part: boolean;
  strictAndPart: boolean;
  fuzzy: boolean;
  strictAndFuzzy: boolean;
}

export interface Version2 extends NunzeOptionBase {
  version: 2;
  data: {
    lodestone: LodeStone;
    search: {
      sites: Site[];
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
    },
  } as Version2;
}
