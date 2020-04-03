import { LogData } from '../../events/lodestone/log/data';

export interface SaveLogsMessage {
  method: 'Nunze_saveLogs';
  items: LogData[];
}

export interface SaveLogsResponse {
  method: 'Nunze_saveLogs';
  succeed: boolean;
}

export function isSaveLogsResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is SaveLogsResponse {
  return response.method === 'Nunze_saveLogs';
}
