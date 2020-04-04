//
// messages to main -> sub
//
export interface FirstLoadMessage {
  method: 'Nunze_SL_FIRST_LOAD';
  data: '';
}

export type MainToSubMessages = FirstLoadMessage;

//
// messages to sub window -> main
//
export interface SubLoadedMessage {
  method: 'Nunze_SL_SUB_LOADED';
  data: '';
}

export interface SubFirstLoadMessage {
  method: 'Nunze_SL_SUB_FIRST_LOADED';
  data: string;
}

export type SubToMainMessages = SubFirstLoadMessage | SubLoadedMessage;

export interface InvalidMessage {
  method: 'Nunze_Invalid';
  data: '';
}
