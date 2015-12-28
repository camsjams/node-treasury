'use strict';

var BaseAdapter = require('./base');
// it's a cache hash === cash
var cache = {};

function getCacheItem(key) {
    var value = false;
    if (cache[key]) {
        if (cache[key].expires > Date.now()) {
            try {
                value = JSON.parse(cache[key].value);
            } catch (e) {
                value = null;
            }
        } else {
            delete cache[key];
        }
    }
    return value;
}

class MemoryClientAdapter extends BaseAdapter {
    getData(key) {
        return new this.promiseFactory(function(resolve, reject) {
            var item = getCacheItem(key);
            if (item) {
                return resolve(item);
            }

            reject(null);
        });
    }

    setData(key, value, ttl) {
        return new this.promiseFactory(function(resolve) {
            var expiresAt = Date.now() + ~~(ttl);
            cache[key] = {
                expires: expiresAt,
                value: JSON.stringify(value)
            };

            resolve(expiresAt);
        });
    }

    deleteData(key) {
        return new this.promiseFactory(function(resolve) {
            delete cache[key];
            resolve(true);
        });
    }
}

module.exports = MemoryClientAdapter;