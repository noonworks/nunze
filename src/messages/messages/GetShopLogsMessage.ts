import { RowItem } from '../../pages/shopLog/common';

export interface GetShopLogsMessage {
  method: 'Nunze_getShopLogs';
}

export interface GetShopLogsResponse {
  method: 'Nunze_getShopLogs';
  items: RowItem[];
}

export function isGetShopLogsResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is GetShopLogsResponse {
  return response.method === 'Nunze_getShopLogs';
}
