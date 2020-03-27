<template>
  <div>
    <Spinner :shown="true" :loading="true"></Spinner>

    <InitializeButton></InitializeButton>

    <SearchSites v-model="sites"></SearchSites>

    <section>
      <h1>LodeStone読み取り</h1>

      <LodestoneUse v-model="opt.data.lodestone.use"></LodestoneUse>

      <RetainerSearch v-model="opt.data.lodestone"></RetainerSearch>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { DEFAULT_OPTIONS } from '../events/option';
import { sendSaveOptionDataRequest, autoSave } from './common';
import { Version2, Site } from '../events/option/version2';
import InitializeButton from './components/InitializeButton.vue';
import LodestoneUse from './components/LodestoneUse.vue';
import RetainerSearch from './components/RetainerSearch.vue';
import SearchSites, { SearchSite } from './components/SearchSites.vue';
import Spinner from './components/Spinner.vue';

@Component({
  components: {
    InitializeButton,
    LodestoneUse,
    RetainerSearch,
    SearchSites,
    Spinner,
  },
})
export default class App extends Vue {
  opt: Version2 = DEFAULT_OPTIONS;

  sitesCache: SearchSite[] = [];
  public get sites(): SearchSite[] {
    if (this.sitesCache.length === 0) {
      this.sitesCache = this.opt.data.search.sites.map((s, index) => {
        return {
          ...s,
          key: `${index}_${s.name}`,
        };
      });
    }
    return this.sitesCache;
  }
  public set sites(value: SearchSite[]) {
    this.sitesCache = value;
    this.opt.data.search.sites = this.sitesCache.map((s) => {
      return { use: s.use, name: s.name, url: s.url };
    });
  }

  @Watch('opt', { deep: true })
  onChange() {
    autoSave(this.$data.opt as Version2);
  }
}
</script>
