import { LodestoneMetadata } from './loadMetadata';
import { loadBaggageItems } from './loadBaggageItems';
import { failAlert } from './util';
import {
  sendSaveFreeCompanyRequest,
  sendSaveInventoriesRequest,
} from '../requests';

export function loadFCChest(meta: LodestoneMetadata): void {
  const fc = {
    id: meta.fc.id,
    name: meta.fc.name,
    world: meta.character.world,
    loadDateTime: new Date().getTime(),
  };
  loadBaggageItems()
    .then((items) => {
      const inv = {
        characterId: 'FREECOMPANY',
        retainerId: meta.fc.id,
        loadDateTime: fc.loadDateTime,
        items,
      };
      // FC情報の保存
      sendSaveFreeCompanyRequest(fc)
        .then(() => {
          // FCチェスト情報の保存
          sendSaveInventoriesRequest([inv], false)
            .then(() => {
              alert('[Nunze]FCチェスト情報を保存しました。');
            })
            .catch(() => {
              failAlert('FCチェスト情報の保存');
            });
        })
        .catch(() => {
          failAlert('FC情報の保存');
        });
    })
    .catch(() => {
      failAlert('FCチェスト情報の取得');
    });
}
