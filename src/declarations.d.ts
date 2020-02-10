
interface TreasuryClient {

}

type Callback = (error: Error, results: string) => void;

interface RedisTreasuryClient extends TreasuryClient {
	get: (key: string, callback: Callback) => void;
	setex: (key: string, expiresIn: number, value: string, callback: Callback) => void;
	del: (key: string, callback: Callback) => void;
}

interface MemcachedTreasuryClient extends TreasuryClient {
	get: (key: string, callback: Callback) => void;
	set: (key: string, value: string, expiresIn: number, callback: Callback) => void;
	del: (key: string, callback: Callback) => void;
}

type TreasuryAdapter = {
	client: TreasuryClient;

	get<T>(key: string): Promise<T>;

	set<T>(key: string, value: T, ttl: number): Promise<true>;

	del(key: string): Promise<true>;

	parseJson(value: string): object;
}
