<template>
  <fieldset class="subgroup" :disabled="!use">
    <h2>
      リテイナー所持品検索の条件
      <span>（LodeStone読み取り有効時のみ）</span>
    </h2>
    <p>
      読み取りから
      <input type="number" v-model.number="expireDate" />
      日以上経過したデータは検索に利用しない
    </p>
    <label>
      <input type="checkbox" v-model="part" />
      部分一致検索を有効にする
    </label>
    <BaseDescription>
      <p>アイテム名の部分一致での検索を有効にします。</p>
      <p>
        （例：「小麦」で検索した際に、「小麦粉」「ハイランド小麦」等の候補も表示される。）
      </p>
    </BaseDescription>
    <fieldset class="subgroup" :disabled="!part">
      <label>
        <input type="checkbox" v-model="strictAndPart" />
        完全一致が見つかっても、部分一致も表示する（部分一致検索有効時のみ）
      </label>
      <BaseDescription>
        <p>
          チェックを入れないと、完全一致アイテムが見つかった時点で検索を中止します。
        </p>
        <p>
          （例：「小麦」が見つかった場合、「小麦粉」「ハイランド小麦」等は候補に表示されない。）
        </p>
      </BaseDescription>
      <BaseDescription>
        <p>
          チェックを入れると、完全一致アイテムが見つかった場合でも、部分一致検索を実行します。
        </p>
        <p>
          （例：「小麦」が見つかった場合でも、「小麦粉」「ハイランド小麦」等も候補に表示される。）
        </p>
      </BaseDescription>
    </fieldset>
    <label>
      <input type="checkbox" v-model="fuzzy" />
      あいまい検索を有効にする
    </label>
    <BaseDescription>
      <p>一部の文字の全角／半角の違い等を無視して検索します。</p>
    </BaseDescription>
    <fieldset class="subgroup" :disabled="!fuzzy">
      <label>
        <input type="checkbox" v-model="strictAndFuzzy" />
        完全一致が見つかっても、あいまい検索結果も表示する（あいまい検索有効時のみ）
      </label>
      <BaseDescription>
        <p>
          チェックを入れないと、完全一致アイテムが見つかった時点で検索を中止します。
        </p>
        <p>
          チェックを入れると、完全一致アイテムが見つかった場合でも、あいまい検索を実行します。
        </p>
      </BaseDescription>
    </fieldset>
  </fieldset>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BaseDescription from './BaseDescription.vue';
import { LodeStone } from '../../events/option/version2';

@Component({ components: { BaseDescription } })
export default class RetainerSearch extends Vue {
  @Prop({ type: Object, required: true }) readonly value!: LodeStone;

  private updateValue(diff: { [key: string]: any }): void {
    this.$emit('input', { ...this.value, ...diff });
  }

  public get use(): boolean {
    return this.value.use;
  }

  public get expireDate(): number {
    return this.value.expireDate;
  }
  public set expireDate(expireDate: number) {
    this.updateValue({ expireDate });
  }

  public get part(): boolean {
    return this.value.part;
  }
  public set part(part: boolean) {
    this.updateValue({ part });
  }

  public get strictAndPart(): boolean {
    return this.value.strictAndPart;
  }
  public set strictAndPart(strictAndPart: boolean) {
    this.updateValue({ strictAndPart });
  }

  public get fuzzy(): boolean {
    return this.value.fuzzy;
  }
  public set fuzzy(fuzzy: boolean) {
    this.updateValue({ fuzzy });
  }

  public get strictAndFuzzy(): boolean {
    return this.value.strictAndFuzzy;
  }
  public set strictAndFuzzy(strictAndFuzzy: boolean) {
    this.updateValue({ strictAndFuzzy });
  }
}
</script>
