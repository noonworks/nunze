<template>
  <div>
    <label>
      <input type="checkbox" v-model="checked" />
      LodeStoneから情報を読み取る
    </label>
    <BaseDescription>
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
    </BaseDescription>
    <BaseDescription>
      <p>
        LodeStoneからの情報読み取りを有効にすると、以下の機能が使用できます。
      </p>
      <ul>
        <li>リテイナーの所持品からのアイテム検索</li>
      </ul>
    </BaseDescription>
    <BaseDescription>
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
    </BaseDescription>
    <BaseDescription>
      <p>
        機能の使用を止めるときには、以下のボタンでデータを削除できます。
      </p>
      <button id="deletelodestonedata">
        LodeStoneから読み取った情報を削除する
      </button>
    </BaseDescription>
    <BaseDescription>
      <h4>読み取り方法</h4>
      <ol>
        <li>
          <a href="http://jp.finalfantasyxiv.com/lodestone/" target="blank"
            >LodeStone</a
          >にログインします。
        </li>
        <li>
          <a href="http://jp.finalfantasyxiv.com/lodestone/my/">マイページ</a
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
    </BaseDescription>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BaseDescription from './BaseDescription.vue';

@Component({ components: { BaseDescription } })
export default class LodestoneUse extends Vue {
  @Prop({ type: Boolean, required: false, default: false })
  readonly value!: boolean;

  public get checked(): boolean {
    return this.value;
  }

  public set checked(val: boolean) {
    this.$emit('input', val);
  }
}
</script>
