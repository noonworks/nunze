import { LodestoneMetadata } from './loadMetadata';
import { sendMessage } from '../../messages';
import { loadBaggageItems } from './loadBaggageItems';
import { failAlert } from './util';
import { isSaveInventoriesResponse } from '../../messages/SaveInventories';
import { isSaveFreeCompanyResponse } from '../../messages/SaveFreeCompany';

export function loadFCChest(meta: LodestoneMetadata): void {
  const fc = {
    id: meta.fc.id,
    name: meta.fc.name,
    loadDateTime: new Date().getTime(),
  };
  const inv = {
    characterId: 'FREECOMPANY',
    retainerId: meta.fc.id,
    loadDateTime: fc.loadDateTime,
    items: loadBaggageItems(),
  };
  // FC情報の保存
  sendMessage(
    {
      method: 'Nunze_saveFreeCompany',
      fc: fc,
    },
    (response) => {
      if (
        !response ||
        !isSaveFreeCompanyResponse(response) ||
        !response.succeed
      ) {
        failAlert('FC情報の保存');
        return;
      }
      // FCチェスト情報の保存
      sendMessage(
        {
          method: 'Nunze_saveInventories',
          inventories: [inv],
          inCrawling: false,
        },
        (response) => {
          if (
            !response ||
            !isSaveInventoriesResponse(response) ||
            response.status == 'fail'
          ) {
            failAlert('FCチェスト情報の保存');
          } else if (response.status == 'completed')
            alert('[Nunze]FCチェスト情報を保存しました。');
        }
      );
    }
  );
}
