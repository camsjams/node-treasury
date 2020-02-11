
import getAdapter, {TreasuryAdapter} from './adapter';
import {TreasuryClient} from './adapters/base';
import getKey from './utils/getKey';
import getCleanedOptions, {TreasuryConfig, TreasuryOptions} from './utils/getCleanedOptions';

export type InvestOptions = {
	namespace?: string;
	ttl?: number;
}

export type DivestOptions = {
	namespace?: string;
}

class Treasury {
	config: TreasuryConfig;

	treasury: TreasuryAdapter;

	constructor(options: TreasuryOptions) {
		this.config = getCleanedOptions(options);
		this.treasury = getAdapter(this.config.client as TreasuryClient);
	}

	async invest<T>(thePromise: (p: TreasuryOptions) => Promise<T>, options: InvestOptions = {}): Promise<T> {
		const ns = options.namespace || this.config.namespace;
		const key = getKey(options, ns);
		const ttl = ~~(options.ttl || this.config.ttl);

		let value: T;
		try {
			value = await this.treasury.get<T>(key);
		} catch (error) {
			value = await thePromise(this.config);
			this.treasury.set(key, value, ttl);
		}

		return value;
	}

	divest<T>(options: DivestOptions = {}): Promise<true> {
		const ns = options.namespace || this.config.namespace;
		const key = getKey(options, ns);

		return this.treasury.del(key);
	}
}

export default Treasury;
