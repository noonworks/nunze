'use strict';
class MigratableLocalStorage {
  constructor(key, default_data) {
    this.key = key;
    this.default_data = default_data;
  }
  // Migrate and Save data
  save(data) {
    console.log('MigratableLocalStorage.save', data);
    data = this.migrate(data);
    localStorage.setItem(this.key, JSON.stringify(data));
    return data;
  }
  // Load and Migrate data
  load() {
    console.log('MigratableLocalStorage.load');
    console.log('-- load from local storage.');
    let str = localStorage.getItem(this.key);
    if (!str) {
      console.log('-- no data. use default data.');
      str = JSON.stringify(this.default_data);
      localStorage.setItem(this.key, str);
    }
    return this.migrate(JSON.parse(str));
  }
  // Reset data
  reset() {
    this.save(this.default_data);
    return this.load();
  }
  // Remove data
  remove() {
    localStorage.removeItem(this.key);
  }
  // Migrate (dummy now)
  migrate(data) {
    return data;
  }
}

class CacheLocalStorage extends MigratableLocalStorage {
  constructor(key, default_data) {
    super(key, default_data);
    this.cache = null;
  }
  // Save and Cache data
  save(data) {
    console.log('CacheLocalStorage.save', data);
    this.cache = super.save(data);
    return this.cache;
  }
  // Load and Cache data
  load(reload) {
    console.log('CacheLocalStorage.load', reload);
    if (this.cache == null) reload = true;
    if (reload) this.cache = super.load();
    return this.cache;
  }
  // Reset and Cache data
  reset() {
    this.save(this.default_data);
    this.cache = super.load();
    return this.cache;
  }
  // Clear cache
  clearCache() {
    this.cache = null;
  }
}

class OptionsStorage extends CacheLocalStorage {
  save(opt) {
    super.save(opt);
    refreshMenu();
    return super.cache;
  }
}

const DEBOUNCESAVECACHESTORAGE_INTERVAL = 500;
class DebounceSaveCacheStorage extends CacheLocalStorage {
  constructor(key, default_data) {
    super(key, default_data);
    this.save_timer = null;
  }
  save(data) {
    clearTimeout(this.save_timer);
    const me = this;
    this.save_timer = setTimeout(function() {
      console.log('DebounceCacheStorage.save');
      me._doDebounceSave(data);
    }, DEBOUNCESAVECACHESTORAGE_INTERVAL);
  }
  _doDebounceSave(data) {
    super.save(data);
  }
}

class StorageCollection {
  constructor(key, storageClass, default_data) {
    this.key = key;
    this.storageClass = storageClass;
    this.default_data = default_data;
    this.collection = {};
  }
  _getSubStorage(subKey) {
    if (Object.keys(this.collection).indexOf(subKey) <= 0) {
      // not found in collection - create storageClass instance
      const st = new this.storageClass(this.key + '_' + subKey, this.default_data);
      this.collection[subKey] = st;
    }
    return this.collection[subKey];
  }
  save(subKey, data) {
    return this._getSubStorage(subKey).save(data);
  }
  load(subKey, reload) {
    return this._getSubStorage(subKey).load(reload);
  }
  loadAll(reload) {
    const ret = [];
    const me = this;
    Object.keys(localStorage).forEach(function(key) {
      if (key.indexOf(me.key + '_') == 0) {
        const subKey = key.substring(me.key.length + 1, key.length);
        ret.push(me._getSubStorage(subKey).load(reload));
      }
    });
    return ret;
  }
  remove(subKey) {
    const subkeys = Object.keys(this.collection);
    if (subkeys.indexOf(subKey) >= 0) {
      this.collection[subKey].remove();
      delete this.collection[subKey];
      return;
    }
    const keys = Object.keys(localStorage);
    const key = this.key + '_' + subKey;
    if (keys.indexOf(key) >= 0) {
      const st = new this.storageClass(key, this.default_data);
      st.remove();
    }
  }
  removeAll() {
    const subkeys = Object.keys(this.collection);
    for (let i = 0; i < subkeys.length; i++) {
      this.collection[subkeys[i]].remove();
      delete this.collection[subkeys[i]];
    }
    const me = this;
    Object.keys(localStorage).forEach(function(key) {
      if (key.indexOf(me.key + '_') == 0) {
        const st = new me.storageClass(key, me.default_data);
        st.remove();
      }
    });
  }
}
