
import getAdapter from './adapter';
import getKey from './utils/getKey';
import getCleanedOptions from './utils/getCleanedOptions';

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
		this.treasury = getAdapter(this.config.client);
	}

	async invest<T>(thePromise: (p: TreasuryOptions) => Promise<T>, overrides: InvestOptions): Promise<T> {
		const options = overrides || {
			namespace: overrides.namespace || this.config.namespace,
			ttl: overrides.ttl || this.config.ttl
		};

		// get from cache
		// -- if found in cache
		// ---- return value via promise
		// -- if not found in cache
		// ---- run promise for value
		// ------ if promise successful
		// -------- set to cache
		// ---------- return data via promise
		// end consumer handles all catches except cache failure!

		const key = getKey(this.config, options.namespace);
		const ttl = ~~options.ttl;

		return this.treasury.get<T>(key)
			.catch(() => thePromise(this.config)
				.then((promisedValue) => this.treasury.set(key, promisedValue, ttl)
					.then(() => promisedValue)));
	}

	divest<T>(options: DivestOptions = {}): Promise<true> {
		const ns = options.namespace || this.config.namespace;
		const key = getKey(options, ns);

		return this.treasury.del(key);
	}
}

export default Treasury;
