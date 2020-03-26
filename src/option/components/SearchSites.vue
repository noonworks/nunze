<template>
  <section>
    <h1>検索サイト</h1>
    <BaseDescription>
      <p>右クリックメニューに表示される検索サイトを管理できます。</p>
      <ul>
        <li>
          「使用する」チェックがついている検索サイトのみ、メニューに表示されます。
        </li>
        <li>「名前」には、メニューで表示される名前を指定します。</li>
        <li>
          「URL」には、検索時のURLを指定します。<code>&lt;WORD&gt;</code>に<code>encodeURIComponent</code>でエンコードされた検索対象単語が入ります。
        </li>
        <li>
          入力内容にエラーがある検索サイトは、メニューに表示されません。
        </li>
      </ul>
    </BaseDescription>
    <div :class="$style.sites">
      <transition-group name="search-sites" tag="ul">
        <li v-for="(site, index) in value" :key="site">
          <fieldset
            :class="{
              [$style.searchSite]: true,
              disabled: !site.use,
              error: site.use && !validSite[index],
            }"
          >
            <legend>
              <label>
                <input
                  type="checkbox"
                  :value="site.use"
                  @input="(use) => updateSite({ use }, index)"
                />
                使用する
              </label>
            </legend>
            <p :class="$style.siteNumber">{{ index + 1 }}</p>
            <label :class="{ error: site.use && !validSiteName[index] }">
              名前
              <input
                type="text"
                :disabled="!site.use"
                :value="site.name"
                @input="(name) => updateSite({ name }, index)"
              />
            </label>
            <br />
            <label :class="{ error: site.use && !validSiteUrl[index] }">
              URL
              <input
                type="url"
                :disabled="!site.use"
                :value="site.url"
                @input="(url) => updateSite({ url }, index)"
              />
            </label>
            <br />
            <button @click="upSearchSite(index)" :disabled="(index == 0)">
              ▲ 上へ移動 ▲
            </button>
            <button
              @click="downSearchSite(index)"
              :disabled="(index == value.length - 1)"
            >
              ▼ 下へ移動 ▼
            </button>
            <button @click="removeSearchSite(index)">× 削除 ×</button>
          </fieldset>
        </li>
      </transition-group>
      <button @click="addSearchSite()">検索サイトを追加</button>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BaseDescription from './BaseDescription.vue';
import { Site } from '../../events/option/version2';

@Component({ components: { BaseDescription } })
export default class SearchSites extends Vue {
  @Prop({ type: Object, required: true }) readonly value!: Site[];

  public get validSiteName(): boolean[] {
    return this.value.map((s) => s.name.length > 0);
  }

  public get validSiteUrl(): boolean[] {
    return this.value.map((s) => s.url.length > 0);
  }

  public get validSite(): boolean[] {
    return this.validSiteName.map((s, index) => {
      return s && this.validSiteUrl[index];
    });
  }

  public updateSite(site: Site, index: number): void {
    const sites = [
      ...this.value.slice(0, index),
      site,
      ...this.value.slice(index + 1),
    ];
    this.$emit('input', sites);
  }

  public upSearchSite(index: number): void {
    if (index <= 0) return;
    if (index > this.value.length - 1) return;
    const sites = [
      ...this.value.slice(0, index - 1),
      this.value[index],
      this.value[index - 1],
      ...this.value.slice(index + 1),
    ];
    this.$emit('input', sites);
  }

  public downSearchSite(index: number): void {
    if (index < 0) return;
    if (index >= this.value.length - 1) return;
    const sites = [
      ...this.value.slice(0, index),
      this.value[index + 1],
      this.value[index],
      ...this.value.slice(index + 2),
    ];
    this.$emit('input', sites);
  }

  public removeSearchSite(index: number): void {
    const sites = [
      ...this.value.slice(0, index),
      ...this.value.slice(index + 1),
    ];
    this.$emit('input', sites);
  }

  public addSearchSite(): void {
    const sites = [
      ...this.value,
      {
        use: true,
        name: '新しい検索サイト',
        url: '',
      },
    ];
    this.$emit('input', sites);
  }
}
</script>

<style>
.search-sites-move {
  transition: transform 0.2s;
}
.search-sites-enter-active {
  transition: all 0.3s;
}
.search-sites-enter {
  opacity: 0;
  transform: scaleX(0) translateX(50%);
}
.search-sites-leave-active {
  transition: all 0.2s;
}
.search-sites-leave-to {
  opacity: 0;
  transform: scaleX(0) translateX(50%);
}
</style>
<style module>
.sites ul {
  margin: 0;
  padding: 0;
}
.sites ul li {
  list-style-type: none;
}
.siteNumber {
  margin: 0;
  padding-top: 2em;
  float: right;
  text-align: center;
  font-weight: bold;
  color: #888;
}
.searchSite > input {
  margin-bottom: 0.5em;
}
.searchSite > button {
  margin-right: 0.5em;
}
</style>
