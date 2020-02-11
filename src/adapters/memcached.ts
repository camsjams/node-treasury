import BaseAdapter, {TreasuryClient, Callback} from './base';

interface MemcachedTreasuryClient extends TreasuryClient {
	set: (key: string, value: string, expiresIn: number, callback: Callback) => void;
}

class MemcachedClientAdapter extends BaseAdapter {
	get<T>(key: string): Promise<T> {
		const memcachedClient = this.client as MemcachedTreasuryClient;
		return new Promise((resolve, reject) => {
			memcachedClient.get(key, (error, results) => {
				if (error || results === undefined) {
					return reject(null);
				}

				resolve(this.parseJson(results) as unknown as T);
			});
		});
	}

	set<T>(key: string, value: T, ttl: number): Promise<true> {
		const memcachedClient = this.client as MemcachedTreasuryClient;
		const serialized = JSON.stringify(value);
		return new Promise((resolve, reject) => {
			memcachedClient.set(key, serialized, ttl, (error) => {
				if (error) {
					return reject(error);
				}

				resolve(true);
			});
		});
	}

	del(key: string): Promise<true> {
		const memcachedClient = this.client as MemcachedTreasuryClient;

		return new Promise((resolve, reject) => {
			memcachedClient.del(key, (error, results) => {
				if (error || results === null) {
					return reject(null);
				}

				resolve(true);
			});
		});
	}
}

export default MemcachedClientAdapter;
