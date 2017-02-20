'use strict';

var BaseAdapter = require('./base');

// it's a cache hash === cash
var cache = {};

class MemoryClientAdapter extends BaseAdapter {
	get(key) {
		var self = this;
		return new this.PromiseFactory((resolve, reject) => {
			var item = self.getCacheItem(key);
			if (item) {
				return resolve(item);
			}

			reject(null);
		});
	}

	set(key, value, ttl) {
		return new this.PromiseFactory((resolve) => {
			var expiresAt = Date.now() + ~~ttl;
			cache[key] = {
				expires: expiresAt,
				value: JSON.stringify(value)
			};

			resolve(true);
		});
	}

	del(key) {
		return new this.PromiseFactory((resolve) => {
			delete cache[key];
			resolve(true);
		});
	}

	getCacheItem(key) {
		var value = false;
		if (cache[key]) {
			if (cache[key].expires > Date.now()) {
				value = this.getUnserializedData(cache[key].value);
			} else {
				delete cache[key];
			}
		}
		return value;
	}
}

module.exports = MemoryClientAdapter;
