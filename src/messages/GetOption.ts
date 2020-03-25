import { NunzeOptionBase } from '../events/option/option';

export interface GetOptionMessage {
  method: 'Nunze_getOption';
}

export interface GetOptionResponse {
  method: 'Nunze_getOption';
  opt: NunzeOptionBase;
}

export function isGetOptionResponse(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response: any
): response is GetOptionResponse {
  return response.method === 'Nunze_getOption';
}
