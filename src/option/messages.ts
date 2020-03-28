//
// messages to sub window -> main window
export interface SubFirstLoadMessage {
  method: 'Nunze_OPTIONS_SUB_FIRST_LOADED';
  data: string;
}

export interface OptionSubSavedMessage {
  method: 'Nunze_OPTIONS_SUB_SAVED';
  data: '';
}

export interface SubResetMessage {
  method: 'Nunze_OPTIONS_SUB_RESET';
  data: string;
}

export interface LodestoneDeletedMessage {
  method: 'Nunze_LODESTONE_DATA_DELETED';
  data: '';
}

export interface SubLoadedMessage {
  method: 'Nunze_OPTIONS_SUB_LOADED';
  data: '';
}

export type SubToMainMessages =
  | SubFirstLoadMessage
  | OptionSubSavedMessage
  | SubResetMessage
  | LodestoneDeletedMessage
  | SubLoadedMessage;

//
// messages to main -> sub
//
export interface SaveDataMessage {
  method: 'Nunze_OPTIONS_SAVE_OPTION_DATA';
  data: string;
}

export interface ResetOptionsMessage {
  method: 'Nunze_OPTIONS_RESET';
  data: string;
}

export interface DeleteLodestoneDataMessage {
  method: 'NUNZE_DELETE_LODESTONE_DATA';
  data: '';
}

export interface FirstLoadMessage {
  method: 'Nunze_OPTIONS_FIRST_LOAD';
  data: '';
}

export type MainToSubMessages =
  | SaveDataMessage
  | ResetOptionsMessage
  | DeleteLodestoneDataMessage
  | FirstLoadMessage;

export interface InvalidMessage {
  method: 'Nunze_Invalid';
  data: '';
}
