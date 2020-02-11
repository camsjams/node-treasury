export interface TreasuryClient {
	get: (key: string, callback: Callback) => void;
	del: (key: string, callback: Callback) => void;
}

export type Callback = (error: Error, results: string) => void;

interface RedisTreasuryClient extends TreasuryClient {
	setex: (key: string, expiresIn: number, value: string, callback: Callback) => void;
}

interface MemcachedTreasuryClient extends TreasuryClient {
	set: (key: string, value: string, expiresIn: number, callback: Callback) => void;
}

type TreasuryAdapter = {
	client: TreasuryClient;

	get<T>(key: string): Promise<T>;

	set<T>(key: string, value: T, ttl: number): Promise<true>;

	del(key: string): Promise<true>;

	parseJson(value: string): object;
}

class BaseAdapter {
	client: TreasuryClient;

	constructor(client: TreasuryClient) {
		this.client = client;
	}

	get<T>(key: string): Promise<T> { // eslint-disable-line no-unused-vars
		return Promise.resolve({} as T);
	}

	set<T>(key: string, value: T, ttl: number): Promise<true> { // eslint-disable-line no-unused-vars
		return Promise.resolve(true);
	}

	del(key: string): Promise<true> { // eslint-disable-line no-unused-vars
		return Promise.resolve(true);
	}

	parseJson(value: string): object {
		let parsed = null;
		try {
			parsed = JSON.parse(value);
		} catch (e) {
			parsed = null;
		}

		return parsed;
	}
}

export default BaseAdapter;
