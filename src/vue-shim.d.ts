declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue-good-table' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const VueGoodTable: any;
}

declare module 'vue-ctk-date-time-picker' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const VueCtkDateTimePicker: any;
  export default VueCtkDateTimePicker;
}
