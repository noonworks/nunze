<template>
  <div>
    <button :disabled="disabled" @click="$emit('reset')">
      設定を初期化する
    </button>
    <div :class="$style.error" v-show="error">
      <p>
        設定を正常に読み込めませんでした。設定データが破損している可能性があります。
      </p>
      <p>[設定を初期化する]ボタンを押して、設定データを初期化してください。</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class InitializeButton extends Vue {
  @Prop({ type: Boolean, required: true }) readonly error!: boolean;

  @Prop({ type: Boolean, required: false, default: false })
  disabled!: boolean;
}
</script>

<style module>
.error {
  margin: 1em 0;
  padding: 1em;
  background-color: #ffcece;
  border-radius: 4px;
  border: 1px solid #c10101;
}
.error p {
  margin: 0;
  color: #c10101;
}
</style>
