<template>
  <div>
    <h2>販売履歴</h2>
    <vue-good-table :columns="columns" :rows="rows" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { VueGoodTable } from 'vue-good-table';
import { RowItem, RowApp } from './common';

interface Label {
  label: string;
  field: string;
  type?: 'number' | 'date';
  dateInputFormat?: string;
  dateOutputFormat?: string;
}

const DEFAULT_COLUMNS: Label[] = [
  { label: 'リテイナー名', field: 'retainer' },
  { label: 'アイテム名', field: 'name' },
  { label: '取引価格', field: 'price', type: 'number' },
  {
    label: '取引日時',
    field: 'dateTime',
    type: 'date',
    dateInputFormat: 'yyyy-MM-dd HH:mm',
    dateOutputFormat: 'yyyy/MM/dd HH:mm',
  },
  { label: '購入者名', field: 'customer' },
];

@Component({ components: { VueGoodTable } })
export default class App extends Vue implements RowApp {
  private items: RowItem[] = [];

  public get columns(): Label[] {
    return DEFAULT_COLUMNS;
  }

  public get rows(): RowItem[] {
    return this.items;
  }

  public set rows(items: RowItem[]) {
    this.items = items;
  }
}
</script>
