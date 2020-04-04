export interface RowItem {
  id: number;
  name: string;
  retainer: string;
  price: number;
  customer: string;
  dateTime: string;
}

export interface RowApp extends Vue {
  rows: RowItem[];
}

//
// Vue instance
//
let vm: RowApp | null = null;
export function mountVue(app: RowApp): void {
  vm = app;
  vm.$mount('#app');
}
