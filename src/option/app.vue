<template>
  <div>
    <div id="loader" class="hide">
      <div class="spinner"></div>
      <span id="loader-load">読み込み中...</span
      ><span id="loader-save">保存中...</span>
    </div>

    <button id="resetoptions" disabled="disabled">設定を初期化する</button>
    <div id="load-error">
      <p>
        設定を正常に読み込めませんでした。設定データが破損している可能性があります。
      </p>
      <p>[設定を初期化する]ボタンを押して、設定データを初期化してください。</p>
    </div>

    <section id="sec_search">
      <h1>検索サイト</h1>
      <div class="description">
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
      </div>
      <div class="options">
        <transition-group name="search-sites" tag="ul">
          <li v-for="(site, index) in data.search.sites" :key="site">
            <fieldset
              :class="{
                searchsite: true,
                disabled: !site.use,
                error: site.use && !validSite[index],
              }"
            >
              <legend>
                <label>
                  <input type="checkbox" v-model="site.use" />
                  使用する
                </label>
              </legend>
              <p class="sitenumber">{{ index + 1 }}</p>
              <label :class="{ error: site.use && !validSiteName[index] }">
                名前
                <input type="text" :disabled="!site.use" v-model="site.name" />
              </label>
              <br />
              <label :class="{ error: site.use && !validSiteUrl[index] }">
                URL
                <input type="url" :disabled="!site.use" v-model="site.url" />
              </label>
              <br />
              <button @click="upSearchSite(index)" :disabled="(index == 0)">
                ▲ 上へ移動 ▲
              </button>
              <button
                @click="downSearchSite(index)"
                :disabled="(index == data.search.sites.length - 1)"
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

    <section id="sec_lodestone">
      <h1>LodeStone読み取り</h1>
      <div class="options">
        <label>
          <input type="checkbox" v-model="data.lodestone.use" />
          LodeStoneから情報を読み取る
        </label>
        <div class="description">
          <p>表示中のLodeStoneページから情報を読み取ります。</p>
          <ul>
            <li>
              情報を読み取るには<a
                href="http://jp.finalfantasyxiv.com/lodestone/"
                target="blank"
                >LodeStone</a
              >
              にログインする必要があります。
            </li>
            <li>
              ログインID、パスワードおよびワンタイムパスワードは読み取りません。
            </li>
            <li>
              読み取った情報はこのブラウザに保存されます。別のアプリおよびサーバーへの保存・送信は行われません。
            </li>
          </ul>
        </div>
        <div class="description">
          <p>
            LodeStoneからの情報読み取りを有効にすると、以下の機能が使用できます。
          </p>
          <ul>
            <li>リテイナーの所持品からのアイテム検索</li>
          </ul>
        </div>
        <div class="description">
          <p>読み取る情報は以下の通りです。</p>
          <ul>
            <li>
              キャラクター名、ワールド名、キャラクターID（複数のキャラクターを識別して表示するために使用します）
            </li>
            <li>
              リテイナー名、リテイナーID（複数のリテイナーを識別して表示するために使用します）
            </li>
            <li>
              リテイナーの所持品一覧（リテイナーの所持品からアイテム検索を行うために使用します）
            </li>
          </ul>
        </div>
        <div class="description">
          <p>
            機能の使用を止めるときには、以下のボタンでデータを削除できます。
          </p>
          <button id="deletelodestonedata">
            LodeStoneから読み取った情報を削除する
          </button>
        </div>
        <div class="description">
          <h4>読み取り方法</h4>
          <ol>
            <li>
              <a href="http://jp.finalfantasyxiv.com/lodestone/" target="blank"
                >LodeStone</a
              >にログインします。
            </li>
            <li>
              <a href="http://jp.finalfantasyxiv.com/lodestone/my/"
                >マイページ</a
              >などの右上にある、キャラクター情報ボックスの右下の「﹀」をクリックします。<br />
              <img src="img/charabox1.png" alt="" />
            </li>
            <li>
              <strong>[Nunze]</strong>とついたメニューが追加されています。<br />
              <img src="img/charabox2.png" alt="" /><br />
            </li>
            <li>
              追加されるメニューは以下の通りです。
              <ul>
                <li>読み取り可能なデータのページへの移動</li>
                <li>読み取り（読み取り可能なデータのページでのみ表示）</li>
              </ul>
            </li>
            <li>
              メニューをクリックし、画面の指示に従って読み取りを行います。
            </li>
          </ol>
        </div>
        <fieldset class="subgroup" :disabled="!data.lodestone.use">
          <h2>
            リテイナー所持品検索の条件
            <span>（LodeStone読み取り有効時のみ）</span>
          </h2>
          <p>
            読み取りから<input
              type="number"
              v-model.number="data.lodestone.expireDate"
            />日以上経過したデータは検索に利用しない
          </p>
          <label>
            <input type="checkbox" v-model="data.lodestone.part" />
            部分一致検索を有効にする
          </label>
          <div class="description">
            <p>アイテム名の部分一致での検索を有効にします。</p>
            <p>
              （例：「小麦」で検索した際に、「小麦粉」「ハイランド小麦」等の候補も表示される。）
            </p>
          </div>
          <fieldset class="subgroup" :disabled="!data.lodestone.part">
            <label>
              <input type="checkbox" v-model="data.lodestone.strictAndPart" />
              完全一致が見つかっても、部分一致も表示する（部分一致検索有効時のみ）
            </label>
            <div class="description">
              <p>
                チェックを入れないと、完全一致アイテムが見つかった時点で検索を中止します。
              </p>
              <p>
                （例：「小麦」が見つかった場合、「小麦粉」「ハイランド小麦」等は候補に表示されない。）
              </p>
            </div>
            <div class="description">
              <p>
                チェックを入れると、完全一致アイテムが見つかった場合でも、部分一致検索を実行します。
              </p>
              <p>
                （例：「小麦」が見つかった場合でも、「小麦粉」「ハイランド小麦」等も候補に表示される。）
              </p>
            </div>
          </fieldset>
          <label>
            <input type="checkbox" v-model="data.lodestone.fuzzy" />
            あいまい検索を有効にする
          </label>
          <div class="description">
            <p>一部の文字の全角／半角の違い等を無視して検索します。</p>
          </div>
          <fieldset class="subgroup" :disabled="!data.lodestone.fuzzy">
            <label>
              <input type="checkbox" v-model="data.lodestone.strictAndFuzzy" />
              完全一致が見つかっても、あいまい検索結果も表示する（あいまい検索有効時のみ）
            </label>
            <div class="description">
              <p>
                チェックを入れないと、完全一致アイテムが見つかった時点で検索を中止します。
              </p>
              <p>
                チェックを入れると、完全一致アイテムが見つかった場合でも、あいまい検索を実行します。
              </p>
            </div>
          </fieldset>
        </fieldset>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DEFAULT_OPTIONS } from '../events/option';
import { sendSaveOptionDataRequest, autoSave } from './common';
import { Version2 } from '../events/option/version2';

export default Vue.extend({
  data: () => {
    return DEFAULT_OPTIONS;
  },

  computed: {
    validSiteName(): boolean[] {
      return this.data.search.sites.map((s) => {
        return s.name.length > 0;
      });
    },
    validSiteUrl(): boolean[] {
      return this.data.search.sites.map((s) => {
        return s.url.length > 0;
      });
    },
    validSite(): boolean[] {
      return this.validSiteName.map((s, index) => {
        return s && this.validSiteUrl[index];
      });
    },
  },

  methods: {
    // Control Buttons for SearchSites
    removeSearchSite(index: number): void {
      this.data.search.sites.splice(index, 1);
    },
    upSearchSite(index: number): void {
      if (index <= 0) return;
      if (index > this.data.search.sites.length - 1) return;
      this.data.search.sites.splice(
        index - 1,
        2,
        this.data.search.sites[index],
        this.data.search.sites[index - 1]
      );
    },
    downSearchSite(index: number): void {
      if (index < 0) return;
      if (index >= this.data.search.sites.length - 1) return;
      this.data.search.sites.splice(
        index,
        2,
        this.data.search.sites[index + 1],
        this.data.search.sites[index]
      );
    },
    addSearchSite(): void {
      this.data.search.sites.push({
        use: true,
        name: '新しい検索サイト',
        url: '',
      });
    },
  },

  watch: {
    data: {
      handler: function (): void {
        autoSave(this.$data as Version2);
      },
      deep: true,
    },
  },
});
</script>

<style></style>
