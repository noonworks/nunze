export interface SubLoadedMessage {
  method: 'Nunze_OPTIONS_SUB_LOADED';
}

export interface FirstLoadMessage {
  method: 'Nunze_OPTIONS_FIRST_LOAD';
}

export interface SubFirstLoadMessage {
  method: 'Nunze_OPTIONS_SUB_FIRST_LOADED';
  data: string;
}

export interface LodestoneDeletedMessage {
  method: 'Nunze_LODESTONE_DATA_DELETED';
}

export interface SubSavedMessage {
  method: 'Nunze_OPTIONS_SUB_SAVED';
}

export interface SubResetMessage {
  method: 'Nunze_OPTIONS_SUB_RESET';
  data: string;
}

export interface InvalidMessage {
  method: 'Nunze_Invalid';
}

export interface SaveDataMessage {
  method: 'Nunze_OPTIONS_SAVE_OPTION_DATA';
  data: string;
}

export interface ResetOptionsMessage {
  method: 'Nunze_OPTIONS_RESET';
}

export interface DeleteLodestoneDataMessage {
  method: 'NUNZE_DELETE_LODESTONE_DATA';
}

export type OptionMessages =
  | InvalidMessage
  | SubLoadedMessage
  | FirstLoadMessage
  | SubFirstLoadMessage
  | LodestoneDeletedMessage
  | SubSavedMessage
  | SubResetMessage
  | SaveDataMessage
  | ResetOptionsMessage
  | DeleteLodestoneDataMessage;

export interface SaveOptionRequest {
  method: 'Nunze_OPTIONS_SAVE_OPTION_DATA';
  data: string;
}

export interface OptionFirstLoadRequest {
  method: 'Nunze_OPTIONS_FIRST_LOAD';
  data: '';
}

export interface SubFirstLoadedRequest {
  method: 'Nunze_OPTIONS_SUB_FIRST_LOADED';
  data: string;
}

export interface OptionSubSavedRequest {
  method: 'Nunze_OPTIONS_SUB_SAVED';
  data: '';
}

export interface LodestoneDeletedRequest {
  method: 'Nunze_LODESTONE_DATA_DELETED';
  data: '';
}

export interface SubResetRequest {
  method: 'Nunze_OPTIONS_SUB_RESET';
  data: string;
}

export interface SubLoadedRequest {
  method: 'Nunze_OPTIONS_SUB_LOADED';
  data: '';
}

export interface OptionResetRequest {
  method: 'Nunze_OPTIONS_RESET';
  data: '';
}

export interface DeleteLodestoneRequest {
  method: 'NUNZE_DELETE_LODESTONE_DATA';
  data: '';
}

export type OptionRequests =
  | SaveOptionRequest
  | OptionFirstLoadRequest
  | SubFirstLoadedRequest
  | OptionSubSavedRequest
  | LodestoneDeletedRequest
  | SubResetRequest
  | SubLoadedRequest
  | OptionResetRequest
  | DeleteLodestoneRequest;
