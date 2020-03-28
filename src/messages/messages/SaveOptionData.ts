import { Version2 } from '../../events/option/version2';

export interface SaveOptionDataMessage {
  method: 'Nunze_saveOptionData';
  data: Version2;
}

export interface SaveOptionDataResponse {
  method: 'Nunze_saveOptionData';
  succeed: boolean;
}
