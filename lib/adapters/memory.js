'use strict';

var BaseAdapter = require('./base');

class MemoryClientAdapter extends BaseAdapter {

    get(key) {
        if (this.hash[key]) {

        }
    }

    set(key, value) {

    }

    delete(key) {

    }
}

module.exports = MemoryClientAdapter;