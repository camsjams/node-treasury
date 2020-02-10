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
