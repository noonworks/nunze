export const LODESTONE_URL = 'https://jp.finalfantasyxiv.com/lodestone/';

export function buildCharacterUrl(characterId: string): string {
  return LODESTONE_URL + 'character/' + characterId + '/';
}

export function buildRetainerUrl(
  characterId: string,
  retainerId: string
): string {
  return buildCharacterUrl(characterId) + 'retainer/' + retainerId + '/';
}
