class BaseAdapter {
	client: TreasuryClient;

	constructor(client: TreasuryClient) {
		this.client = client;
	}

	get<T>(key: string): Promise<T> {
		return Promise.resolve({} as T);
	}

	set<T>(key: string, value: T, ttl: number): Promise<true> {
		return Promise.resolve(true);
	}

	del(key: string): Promise<true> {
		return Promise.resolve(true);
	}

	parseJson(value: string): object {
		let parsed = null;
		try {
			parsed = JSON.parse(value);
		} catch (e) {
		}

		return parsed;
	}
}

export default BaseAdapter;
