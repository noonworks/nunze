<template>
  <div :class="[$style.loader, shown ? '' : $style.hide]">
    <div :class="$style.spinner"></div>
    <span>{{ loading ? '読み込み中...' : '保存中...' }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Spinner extends Vue {
  @Prop({ type: Boolean, required: true }) readonly shown!: boolean;
  @Prop({ type: Boolean, required: true }) readonly loading!: boolean;
}
</script>

<style module>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes hide {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.loader {
  position: fixed;
  top: 1em;
  right: 2em;
  padding: 0.5em 1.5em;
  border: 1px solid #888;
  border-radius: 4px;
  background-color: #ffffff;
  opacity: 1;
}
.loader.hide {
  opacity: 0;
  animation: hide 1.5s linear 0s;
}
.spinner {
  width: 0.5em;
  height: 0.5em;
  display: inline-block;
  margin-right: 0.3em;
  border-radius: 50%;
  border-top: 3px solid rgba(150, 150, 150, 1);
  border-left: 3px solid rgba(150, 150, 150, 0.8);
  border-bottom: 3px solid rgba(150, 150, 150, 0.5);
  border-right: 3px solid rgba(150, 150, 150, 0.2);
  animation: spin 1s linear infinite;
}
</style>
