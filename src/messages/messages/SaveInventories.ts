import { InventoryData } from '../../events/lodestone/inventory/data';

export interface SaveInventoriesMessage {
  method: 'Nunze_saveInventories';
  inventories: InventoryData[];
  inCrawling: boolean;
}

export interface SaveInventoriesResponse {
  method: 'Nunze_saveInventories';
  status: 'fail' | 'completed' | 'next';
}

export function isSaveInventoriesResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is SaveInventoriesResponse {
  return response.method === 'Nunze_saveInventories';
}
