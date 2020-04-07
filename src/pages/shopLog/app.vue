<template>
  <div>
    <h2>販売履歴</h2>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      :styleClass="'vgt-table ' + $style.vgttable"
      :sort-options="{
        enabled: true,
        initialSortBy: { field: 'dateTime', type: 'desc' },
      }"
    >
      <template slot="table-row" slot-scope="props">
        <span v-if="props.column.field == 'retainer'">
          <a
            :href="
              buildRetainerUrl(
                props.row.retainer.character.id,
                props.row.retainer.retainer.id
              )
            "
            target="_blank"
          >
            {{ props.row.retainer.retainer.name }}
          </a>
          <span :class="$style.character"
            ><a
              :href="buildCharacterUrl(props.row.retainer.character.id)"
              target="_blank"
              >{{ props.row.retainer.character.name }}</a
            ></span
          >
          <span :class="$style.world">{{
            props.row.retainer.character.world
          }}</span>
        </span>
        <template v-else-if="props.column.field == 'name'">
          <a href="javascript:void(0)">
            {{ props.row.name }}
          </a>
        </template>
        <template v-else-if="props.column.field == 'price'">
          {{ separateNum(Math.floor(props.row.total / props.row.num)) }}
        </template>
        <template v-else-if="props.column.field == 'dateTime'">
          <span :class="$style.date">{{ formatDate(props.row.dateTime) }}</span>
          <span :class="$style.time">{{ formatTime(props.row.dateTime) }}</span>
        </template>
        <template v-else>
          {{ props.formattedRow[props.column.field] }}
        </template>
      </template>
      <div slot="emptystate">
        <p>販売履歴が見つかりませんでした。</p>
        <p>
          リテイナー情報が古くなっている可能性があります。
          <a href="http://jp.finalfantasyxiv.com/lodestone/" target="blank"
            >LodeStone</a
          >
          で情報読み取りを行って、再度試してみてください。
        </p>
      </div>
    </vue-good-table>
  </div>
</template>

<style module>
table.vgttable tbody td {
  vertical-align: middle;
}

.character,
.world {
  font-size: 0.7em;
  display: block;
  line-height: 100%;
  margin-top: 2px;
}

.date,
.time {
  display: block;
}
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { VueGoodTable } from 'vue-good-table';
import { RowItem, RowApp, RowRetainer } from './common';
import { buildCharacterUrl, buildRetainerUrl } from '../../master/util';

type FormatFunction = (value: number) => string;
type SortFunction<T> = (x: T, y: T, col: Label, rowX: T, rowY: T) => number;

interface Label {
  label: string;
  field: string;
  type?: 'number' | 'date';
  dateInputFormat?: string;
  dateOutputFormat?: string;
  formatFn?: FormatFunction;
  sortFn?: SortFunction<RowRetainer>;
}

function separateNum(value: number): string {
  return ('' + value).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

function sortRetainer(x: RowRetainer, y: RowRetainer): number {
  return x.retainer.name < y.retainer.name
    ? -1
    : x.retainer.name > y.retainer.name
    ? 1
    : 0;
}

const DEFAULT_COLUMNS: Label[] = [
  { label: 'リテイナー', field: 'retainer', sortFn: sortRetainer },
  { label: 'アイテム', field: 'name' },
  { label: '数量', field: 'num', type: 'number', formatFn: separateNum },
  { label: '単価', field: 'price', type: 'number' },
  { label: '合計', field: 'total', type: 'number', formatFn: separateNum },
  { label: '日時', field: 'dateTime', type: 'number' },
  { label: '購入者', field: 'customer' },
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

  public separateNum(val: number): string {
    return separateNum(val);
  }

  public buildCharacterUrl(characterId: string): string {
    return buildCharacterUrl(characterId);
  }

  public buildRetainerUrl(characterId: string, retainerId: string): string {
    return buildRetainerUrl(characterId, retainerId);
  }

  public formatDate(val: number): string {
    const dt = new Date(val);
    return '' + (dt.getMonth() + 1) + '/' + dt.getDate();
  }

  public formatTime(val: number): string {
    const dt = new Date(val);
    return '' + dt.getHours() + ':' + ('0' + dt.getMinutes()).slice(-2);
  }
}
</script>
