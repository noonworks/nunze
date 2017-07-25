'use strict';
let vm = null;
let subwindow = null;
let loader = null;
let loader_load = null;
let loader_save = null;
let resetbutton = null;

//
// Message Listener
//
window.addEventListener('message', function(msg) {
  if (msg.source != subwindow) return;
  // split method name
  const cln = msg.data.indexOf(':');
  if (cln < 0) return;
  const method = msg.data.substring(0, cln);
  const data = msg.data.substring(cln + 1, msg.data.length);
  // run method
  switch (method) {
  case 'Nunze_OPTIONS_SUB_LOADED':
    // on sub window loaded
    subwindow.postMessage('Nunze_OPTIONS_FIRSTLOAD:', '*');
    break;
  case 'Nunze_OPTIONS_SUB_FIRSTLOADED':
    // on complited first-load
    showData(data);
    hideLoader();
    break;
  case 'Nunze_LOADSTONE_DATA_DELETED':
    // on loadstone data deleted
    alert('削除しました。');
    break;
  case 'Nunze_OPTIONS_SUB_SAVED':
    // on data saved
    hideLoader();
    break;
  case 'Nunze_OPTIONS_SUB_RESETED':
    // on data reseted
    showData(data);
    hideLoader();
    break;
  }
}, false);

//
// Show data
//
function showData(data_str) {
  document.getElementById('load-error').style.display = 'none';
  try {
    const opt = JSON.parse(data_str);
    if (vm == null) {
      createVue(opt);
    } else {
      vm.data = opt.data;
      vm.$forceUpdate();
    }
  } catch (e) {
    document.getElementById('load-error').style.display = 'block';
  }
}

//
// Show/Hide loader
//
function showLoader(isSave) {
  if (isSave) {
    loader_save.style.display = 'inline';
    loader_load.style.display = 'none';
  } else {
    loader_save.style.display = 'none';
    loader_load.style.display = 'inline';
  }
  loader.classList.remove('hide');
  resetbutton.disabled = true;
}
function hideLoader() {
  loader.classList.add('hide');
  resetbutton.disabled = false;
}

//
// Data save request
//
function sendSaveOptionDataRequest(data) {
  showLoader(true);
  subwindow.postMessage('Nunze_OPTIONS_SAVE_OPTION_DATA:' + JSON.stringify(data), '*');
}

//
// Data reset
//
function reset() {
  if (! window.confirm('設定を初期化します。よろしいですか？')) return;
  showLoader(false);
  subwindow.postMessage('Nunze_OPTIONS_RESET:', '*');
}

//
// Delete Loadstone data
//
function deleteLoadstoneData() {
  if (! window.confirm('LoadStoneから読み取った情報を削除します。よろしいですか？\n' +
    '（削除しても再度読み取ることができます。）')) return;
  subwindow.postMessage('NUNZE_DELETE_LOADSTONE_DATA:', '*');
}

//
// Vue initialization
//
function createVue(opt) {
  vm = new Vue({
    el: '#options',
    data: opt,
    computed: {
      // Data without computed properties
      pureData: function() {
        return this.data;
      },
      // Validation functions
      validSiteName: function() {
        return this.data.search.sites.map(function(s){
          return s.name.length > 0;
        });
      },
      validSiteUrl: function() {
        return this.data.search.sites.map(function(s){
          return s.url.length > 0;
        });
      },
      validSite: function() {
        const me = this;
        return this.validSiteName.map(function(s, index){
          return s && me.validSiteUrl[index];
        });
      }
    },
    methods: {
      // Control Buttons for SearchSites
      removeSearchSite: function(index) {
        this.data.search.sites.splice(index, 1);
      },
      upSearchSite: function(index) {
        if (index <= 0) return;
        if (index > this.data.search.sites.length - 1) return;
        this.data.search.sites.splice(index - 1, 2, this.data.search.sites[index], this.data.search.sites[index - 1]);
      },
      downSearchSite: function(index) {
        if (index < 0) return;
        if (index >= this.data.search.sites.length - 1) return;
        this.data.search.sites.splice(index, 2, this.data.search.sites[index + 1], this.data.search.sites[index]);
      },
      addSearchSite: function() {
        this.data.search.sites.push({ use: true, name: '新しい検索サイト', url: '' });
      }
    },
    watch: {
      // Auto save
      'data': {
        handler: _.debounce(function(data) {
          sendSaveOptionDataRequest(this.pureData);
        }, 1000),
        deep: true
      }
    }
  });
  document.getElementById('deleteloadstonedata').addEventListener('click', deleteLoadstoneData);
}

Vue.config.errorHandler = function(err, vm, info) {
  document.getElementById('load-error').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function(){
  subwindow = document.getElementById('subwindow').contentWindow;
  loader = document.getElementById('loader');
  loader_save = document.getElementById('loader-save');
  loader_load = document.getElementById('loader-load');
  resetbutton = document.getElementById('resetoptions');
  document.getElementById('resetoptions').addEventListener('click', reset);
});
