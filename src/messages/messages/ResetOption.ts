import { Version2 } from '../../events/option/version2';

export interface ResetOptionMessage {
  method: 'Nunze_resetOption';
}

export interface ResetOptionResponse {
  method: 'Nunze_resetOption';
  opt: Version2;
}

export function isResetOptionResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is ResetOptionResponse {
  return response.method === 'Nunze_resetOption';
}
