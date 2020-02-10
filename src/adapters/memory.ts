import BaseAdapter from './base';

type Cache = {
	[key: string]: {
		expires: number;
		value: string;
	};
}
const cache: Cache = {}; // it's a cache hash ~~> cash?

class MemoryClientAdapter extends BaseAdapter {
	get<T>(key: string): Promise<T> {
		const item = this.getCacheItem(key);
		if (item) {
			return Promise.resolve(item as unknown as T);
		}

		Promise.reject(null);
	}

	set<T>(key: string, value: T, ttl: number): Promise<true> {
		const expiresAt = Date.now() + ~~ttl;
		cache[key] = {
			expires: expiresAt,
			value: JSON.stringify(value)
		};

		return Promise.resolve(true);
	}

	del(key: string): Promise<true> {
		delete cache[key];
		return Promise.resolve(true);
	}

	getCacheItem(key: string): object {
		let data = null;
		if (cache[key]) {
			if (cache[key].expires > Date.now()) {
				data = this.parseJson(cache[key].value);
			} else {
				delete cache[key];
			}
		}

		return data;
	}
}

export default MemoryClientAdapter;
