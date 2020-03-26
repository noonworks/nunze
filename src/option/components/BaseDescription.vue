<template>
  <div :class="$style.description">
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class BaseDescription extends Vue {}
</script>

<style module>
.description {
  margin: 0.5em 0 0.5em 1em;
  padding: 0.5em 0.75em;
  font-size: 0.9em;
  border-radius: 4px;
  background-color: rgb(245, 245, 245);
  border: 1px solid #cecece;
  color: #525252;
}
.description h4 {
  margin: 0;
}
</style>
