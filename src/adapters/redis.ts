import BaseAdapter, {TreasuryClient, Callback} from './base';

interface RedisTreasuryClient extends TreasuryClient {
	setex: (key: string, expiresIn: number, value: string, callback: Callback) => void;
}

class RedisClientAdapter extends BaseAdapter {
	get<T>(key: string): Promise<T> {
		const redisClient = this.client as RedisTreasuryClient;
		return new Promise((resolve, reject) => {
			redisClient.get(key, (error, results) => {
				if (error || results === null) {
					return reject(null);
				}

				resolve(this.parseJson(results) as unknown as T);
			});
		});
	}

	set<T>(key: string, value: T, ttl: number): Promise<true> {
		const redisClient = this.client as RedisTreasuryClient;
		const serialized = JSON.stringify(value);
		return new Promise((resolve, reject) => {
			redisClient.setex(key, ttl, serialized, (error) => {
				if (error) {
					return reject(error);
				}

				resolve(true);
			});
		});
	}

	del(key: string): Promise<true> {
		const redisClient = this.client as RedisTreasuryClient;
		return new Promise((resolve, reject) => {
			redisClient.del(key, (error, results) => {
				if (error || results === null) {
					return reject(null);
				}

				resolve(true);
			});
		});
	}
}

export default RedisClientAdapter;
